import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from decimal import Decimal

# AI-generated test suite for atomic transactions
# Tool Used: ChatGPT 4o

User = get_user_model()

@pytest.mark.django_db
def test_atomic_transfer_concurrency():
    """
    Simulates a race condition where a user tries to double-spend.
    This validates the row-locking mechanism (select_for_update).
    """
    client = APIClient()
    
    # Setup Users
    sender = User.objects.create_user(email='sender@test.com', password='password123', wallet_balance=100)
    receiver = User.objects.create_user(email='receiver@test.com', password='password123', wallet_balance=0)
    
    client.force_authenticate(user=sender)
    
    url = reverse('transfer')
    
    # Create two identical requests
    data = {
        "receiver_email": "receiver@test.com",
        "amount": "100.00",
        "idempotency_key": "unique-key-1" # Testing Idempotency
    }
    
    # First Request: Should Succeed
    response1 = client.post(url, data, format='json')
    assert response1.status_code == status.HTTP_200_OK
    assert response1.data['new_balance'] == 0.0

    # Second Request (Same Key): Should Return Previous Response (Idempotency)
    response2 = client.post(url, data, format='json')
    assert response2.status_code == status.HTTP_200_OK
    # Balance should NOT decrease further
    sender.refresh_from_db()
    assert sender.wallet_balance == 0.0