import base64
from django.conf import settings
from cryptography.fernet import Fernet

class VaultSecurity:
    """
    Handles AES-256 encryption and decryption for sensitive fields.
    assignment_reference: 'Data Security: Ensure the Aadhaar/ID Number field is stored encrypted'
    """
    
    _cipher = None

    @classmethod
    def get_cipher(cls):
        if cls._cipher is None:
            key = settings.ENCRYPTION_KEY
            if not key:
                raise ValueError("ENCRYPTION_KEY is missing in .env")
            # Ensure key is bytes
            if isinstance(key, str):
                key = key.encode()
            cls._cipher = Fernet(key)
        return cls._cipher

    @staticmethod
    def encrypt(raw_data: str) -> str:
        """Encrypts a string and returns a url-safe base64 encoded string."""
        if not raw_data:
            return ""
        cipher = VaultSecurity.get_cipher()
        encrypted_bytes = cipher.encrypt(raw_data.encode())
        return encrypted_bytes.decode('utf-8')

    @staticmethod
    def decrypt(encrypted_data: str) -> str:
        """Decrypts a base64 encoded encrypted string."""
        if not encrypted_data:
            return ""
        cipher = VaultSecurity.get_cipher()
        decrypted_bytes = cipher.decrypt(encrypted_data.encode())
        return decrypted_bytes.decode('utf-8')