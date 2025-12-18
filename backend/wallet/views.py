from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Transaction, IdempotencyLog
from .serializers import TransferSerializer, TransactionHistorySerializer

User = get_user_model()

class TransferFundsView(APIView):
    """
    Handles atomic money transfers with Idempotency and Row Locking.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransferSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        sender = request.user
        receiver_email = serializer.validated_data['receiver_email']
        amount = serializer.validated_data['amount']
        idem_key = serializer.validated_data['idempotency_key']

        # --- 1. IDEMPOTENCY CHECK ---
        if IdempotencyLog.objects.filter(user=sender, key=idem_key).exists():
            log = IdempotencyLog.objects.get(user=sender, key=idem_key)
            return Response(log.response_body, status=log.response_code)

        try:
            # --- 2. ATOMIC TRANSACTION START ---
            with transaction.atomic():
                receiver = User.objects.get(email=receiver_email)

                # --- 3. DEADLOCK PREVENTION ---
                users_to_lock = sorted([sender.id, receiver.id])
                locked_users = {
                    u.id: u for u in User.objects.select_for_update().filter(id__in=users_to_lock)
                }
                
                sender_locked = locked_users[sender.id]
                receiver_locked = locked_users[receiver.id]

                # --- 4. BUSINESS LOGIC ---
                if sender_locked.wallet_balance < amount:
                    return Response({"error": "Insufficient funds"}, status=400)

                sender_locked.wallet_balance -= amount
                receiver_locked.wallet_balance += amount
                
                sender_locked.save()
                receiver_locked.save()

                tx = Transaction.objects.create(
                    sender=sender,
                    receiver=receiver,
                    amount=amount,
                    status='SUCCESS'
                )
                
                # --- FIX IS HERE ---
                # We must convert complex Python objects (UUID, Decimal) to primitives (str, float)
                # so they can be saved in the JSONField of IdempotencyLog.
                response_data = {
                    "message": "Transfer Successful",
                    "transaction_id": str(tx.reference_id),  # UUID -> String
                    "new_balance": float(sender_locked.wallet_balance) # Decimal -> Float
                }
                
                # --- 5. SAVE IDEMPOTENCY LOG ---
                IdempotencyLog.objects.create(
                    user=sender,
                    key=idem_key,
                    response_body=response_data,
                    response_code=200
                )

                return Response(response_data, status=200)

        except Exception as e:
            # Print error to console for debugging
            print(f"Transfer Error: {str(e)}")
            return Response({"error": str(e)}, status=500)


class TransactionHistoryView(ListAPIView):
    """
    Returns the list of transactions where the user was sender OR receiver.
    """
    serializer_class = TransactionHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-created_at')