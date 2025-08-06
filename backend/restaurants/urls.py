from django.urls import path
from .views import (
    RestaurantListView, RestaurantDetailView, RestaurantMenuView,
    MenuItemListView, MenuItemDetailView, RestaurantStatsView,
    PopularRestaurantsView, SearchRestaurantsView, UserRestaurantListView, RestaurantCreateView
)

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant-list'),
    path('create/', RestaurantCreateView.as_view(), name='restaurant-create'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('<int:restaurant_id>/menus/', RestaurantMenuView.as_view(), name='restaurant-menus'),  # GET, POST menu
    path('menus/<int:menu_id>/', RestaurantMenuView.as_view(), name='menu-detail'),            # PUT, DELETE menu
    path('menus/<int:menu_id>/items/', MenuItemListView.as_view(), name='menu-items'),         # GET, POST menu item
    path('menu-items/<int:pk>/', MenuItemDetailView.as_view(), name='menu-item-detail'),       # PUT, DELETE menu item
    path('<int:restaurant_id>/stats/', RestaurantStatsView.as_view(), name='restaurant-stats'),
    path('popular/', PopularRestaurantsView.as_view(), name='popular-restaurants'),
    path('search/', SearchRestaurantsView.as_view(), name='search-restaurants'),
    path('user/<int:user_id>/restaurants/', UserRestaurantListView.as_view(), name='user-restaurants'),
]
