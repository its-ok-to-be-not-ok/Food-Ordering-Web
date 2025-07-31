from django.urls import path
from .views import (
    RestaurantListView, RestaurantDetailView, RestaurantMenuView,
    MenuItemListView, MenuItemDetailView, RestaurantStatsView,
    PopularRestaurantsView, SearchRestaurantsView, UserRestaurantListView
)

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant-list'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('<int:restaurant_id>/menus/', RestaurantMenuView.as_view(), name='restaurant-menus'),
    path('menus/<int:menu_id>/items/', MenuItemListView.as_view(), name='menu-items'),
    path('menu-items/<int:pk>/', MenuItemDetailView.as_view(), name='menu-item-detail'),
    path('<int:restaurant_id>/stats/', RestaurantStatsView.as_view(), name='restaurant-stats'),
    path('popular/', PopularRestaurantsView.as_view(), name='popular-restaurants'),
    path('search/', SearchRestaurantsView.as_view(), name='search-restaurants'),
    path('user/<int:user_id>/restaurants/', UserRestaurantListView.as_view(), name='user-restaurants'),
]
