from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView,
    RestaurantRegistrationView, RestaurantRegistrationListView,
    RestaurantRegistrationDetailView,  # Thêm view này
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('registrations/', RestaurantRegistrationListView.as_view(), name='restaurant-registrations'),
    path('registrations/<int:pk>/', RestaurantRegistrationDetailView.as_view(), name='restaurant-registration-detail'),
]