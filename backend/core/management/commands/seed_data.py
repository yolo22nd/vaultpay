import random
import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
from wallet.models import Transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with realistic users and transaction history.'

    def handle(self, *args, **kwargs):
        fake = Faker('en_IN') # Use Indian names/addresses
        self.stdout.write(self.style.WARNING('Seeding data...'))

        # 1. Create Users
        users = []
        # Create a specific test user for you to log in with easily
        test_user, created = User.objects.get_or_create(
            email='omtank22@gmail.com',
            defaults={
                'first_name': 'Om', 
                'last_name': 'Tank', 
                'wallet_balance': Decimal('50000.00'),
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            test_user.set_password('password')
            test_user.set_aadhaar("9999-8888-7777")
            test_user.save()
            self.stdout.write(f"Created Superuser: {test_user.email}")
        
        users.append(test_user)

        # Create 20 random users
        for _ in range(20):
            email = fake.unique.email()
            first_name = fake.first_name()
            last_name = fake.last_name()
            aadhaar = f"{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}"
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'wallet_balance': Decimal(random.randint(1000, 50000)),
                    'phone_number': fake.phone_number()[:15]
                }
            )
            if created:
                user.set_password('password')
                user.set_aadhaar(aadhaar)
                user.save()
                users.append(user)

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(users)} users.'))

        # 2. Create Transactions
        transactions_to_create = []
        for _ in range(100):
            sender = random.choice(users)
            receiver = random.choice(users)
            
            if sender == receiver:
                continue

            amount = Decimal(random.randint(100, 5000))
            
            # Simple logic: only create if they have funds (simulation only)
            if sender.wallet_balance >= amount:
                sender.wallet_balance -= amount
                receiver.wallet_balance += amount
                sender.save()
                receiver.save()
                
                # Add transaction record
                transactions_to_create.append(Transaction(
                    sender=sender,
                    receiver=receiver,
                    amount=amount,
                    status='SUCCESS',
                    reference_id=uuid.uuid4()
                ))

        Transaction.objects.bulk_create(transactions_to_create)
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(transactions_to_create)} transactions.'))