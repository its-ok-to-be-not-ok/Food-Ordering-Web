from django.urls import path
from .views import RestaurantListView, DishByRestaurantView

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant_list'),
    path('<int:restaurant_id>/dishes/', DishByRestaurantView.as_view(), name='dishes_by_restaurant'),
]
