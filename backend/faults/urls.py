from django.urls import path
from .views import FaultListCreateView, FaultByRestaurantView, FaultAdminListView

urlpatterns = [
    path('', FaultListCreateView.as_view(), name='fault-list-create'),
    path('<int:restaurant_id>/', FaultByRestaurantView.as_view(), name='fault-by-restaurant'),
    path('all/', FaultAdminListView.as_view(), name='fault-admin-list'),
]