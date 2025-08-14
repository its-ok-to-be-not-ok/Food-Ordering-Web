from django.urls import path
from .views import (
    OrderListView, OrderDetailView, CreateOrderView,
    UpdateOrderStatusView, OrderHistoryView, RestaurantOrdersView, CancelOrderView
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('history/', OrderHistoryView.as_view(), name='order-history'),
    path('restaurant/<int:restaurant_id>/', RestaurantOrdersView.as_view(), name='restaurant-orders'),
    path('<int:order_id>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
]
