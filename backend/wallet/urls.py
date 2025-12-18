from django.urls import path
from .views import TransferFundsView, TransactionHistoryView

urlpatterns = [
    path('transfer/', TransferFundsView.as_view(), name='transfer'),
    path('history/', TransactionHistoryView.as_view(), name='history'),
]