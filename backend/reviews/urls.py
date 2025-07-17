from django.urls import path
from .views import (
    ReviewListView, ReviewCreateView, RestaurantReviewsView,
    MenuItemReviewsView, UserReviewsView
)

urlpatterns = [
    path('', ReviewListView.as_view(), name='review-list'),
    path('create/', ReviewCreateView.as_view(), name='review-create'),
    path('restaurant/<int:restaurant_id>/', RestaurantReviewsView.as_view(), name='restaurant-reviews'),
    path('menu-item/<int:menu_item_id>/', MenuItemReviewsView.as_view(), name='menu-item-reviews'),
    path('user/', UserReviewsView.as_view(), name='user-reviews'),
]
