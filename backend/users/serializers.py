from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    aadhaar_number = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'aadhaar_number', 'phone_number')

    def create(self, validated_data):
        aadhaar_raw = validated_data.pop('aadhaar_number')
        password = validated_data.pop('password')
        
        # Create user instance
        user = User(**validated_data)
        user.set_password(password)
        
        # Encrypt the Aadhaar using our model helper (Assignment 1)
        user.set_aadhaar(aadhaar_raw)
        
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing profile.
    Decrypted Aadhaar is included explicitly.
    """
    aadhaar_number = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'wallet_balance', 'aadhaar_number', 'phone_number', 'created_at')
        read_only_fields = ('wallet_balance', 'email')

    def get_aadhaar_number(self, obj):
        # Assignment 1: "Decrypting the Aadhaar/ID number before sending it to the client."
        # We only show this if the user is looking at their OWN profile (Security Check)
        request = self.context.get('request')
        if request and request.user == obj:
            return obj.get_aadhaar()
        return "REDACTED"
    
    