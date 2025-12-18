from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Transaction

User = get_user_model()

class TransferSerializer(serializers.Serializer):
    receiver_email = serializers.EmailField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    idempotency_key = serializers.UUIDField(required=True)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value

    def validate_receiver_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Receiver does not exist.")
        return value

    def validate(self, data):
        if data['receiver_email'] == self.context['request'].user.email:
            raise serializers.ValidationError("You cannot send money to yourself.")
        return data

class TransactionHistorySerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email')
    receiver_email = serializers.EmailField(source='receiver.email')

    class Meta:
        model = Transaction
        fields = ('reference_id', 'sender_email', 'receiver_email', 'amount', 'status', 'created_at')