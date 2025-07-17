from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView,
    RestaurantRegistrationView, RestaurantRegistrationListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('restaurant-registration/', RestaurantRegistrationView.as_view(), name='restaurant-registration'),
    path('restaurant-registrations/', RestaurantRegistrationListView.as_view(), name='restaurant-registrations'),
]
