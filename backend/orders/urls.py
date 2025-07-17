from django.urls import path
from .views import CreateOrderView, OrderHistoryView

urlpatterns = [
    path('', CreateOrderView.as_view(), name='create_order'),
    path('history/', OrderHistoryView.as_view(), name='order_history'),
]
