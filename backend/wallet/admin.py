from django.contrib import admin
from .models import Transaction, IdempotencyLog

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('reference_id', 'sender', 'receiver', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('reference_id', 'sender__email', 'receiver__email')
    
    # Make fields read-only to ensure Audit Log integrity (Security Best Practice)
    readonly_fields = ('sender', 'receiver', 'amount', 'reference_id', 'created_at')

    def has_delete_permission(self, request, obj=None):
        # Disable deleting transactions (Immutable Ledger)
        return False

@admin.register(IdempotencyLog)
class IdempotencyLogAdmin(admin.ModelAdmin):
    list_display = ('key', 'user', 'response_code', 'created_at')
    search_fields = ('key', 'user__email')
    readonly_fields = ('key', 'user', 'response_body', 'response_code')