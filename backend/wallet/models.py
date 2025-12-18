from django.db import models
from django.conf import settings
from core.models import TimeStampedModel
import uuid

class Transaction(TimeStampedModel):
    STATUS_CHOICES = (
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('PENDING', 'Pending'),
    )

    # Use string 'users.User' to avoid circular imports
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='sent_transactions'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='received_transactions'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    reference_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} : {self.amount}"

class IdempotencyLog(TimeStampedModel):
    """
    Stores processed idempotency keys to prevent double-spending.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    key = models.UUIDField(db_index=True) # The unique key from frontend
    response_body = models.JSONField() # Store the exact response we sent
    response_code = models.IntegerField()

    class Meta:
        unique_together = ('user', 'key')

