from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import TimeStampedModel
from core.security import VaultSecurity
from .managers import CustomUserManager

class User(AbstractUser, TimeStampedModel):
    username = None  # We use email as login
    email = models.EmailField('email address', unique=True)
    
    # Financial Field (Assignment 2 Requirement)
    # Using DecimalField is critical for financial precision (no floating point errors)
    wallet_balance = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=1000.00, # Giving free money for testing
        help_text="Current wallet balance in INR"
    )

    # Security Field (Assignment 1 Requirement)
    # We store the ENCRYPTED string here.
    aadhaar_encrypted = models.TextField(blank=True, null=True)
    
    # Metadata
    phone_number = models.CharField(max_length=15, blank=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def set_aadhaar(self, raw_aadhaar):
        """
        Helper to encrypt Aadhaar before saving.
        Usage: user.set_aadhaar("1234-5678-9012")
        """
        if raw_aadhaar:
            self.aadhaar_encrypted = VaultSecurity.encrypt(raw_aadhaar)

    def get_aadhaar(self):
        """
        Helper to decrypt Aadhaar for viewing.
        Usage: plain_text = user.get_aadhaar()
        """
        if self.aadhaar_encrypted:
            return VaultSecurity.decrypt(self.aadhaar_encrypted)
        return None