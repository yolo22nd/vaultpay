from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Display these columns in the list view
    list_display = ('email', 'first_name', 'last_name', 'wallet_balance', 'is_staff')
    
    # Add filters on the right side
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    
    # Allow searching by email or name
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    
    # Organize the detail view field layout
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Financials', {'fields': ('wallet_balance', 'aadhaar_encrypted')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)