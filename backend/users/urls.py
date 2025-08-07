from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView,
    RestaurantRegistrationView, RestaurantRegistrationListView,
    RestaurantRegistrationDetailView, AdminLoginView,
    AdminAccountListView, AdminAccountDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('registrations/', RestaurantRegistrationListView.as_view(), name='restaurant-registrations'),
    path('registrations/<int:pk>/', RestaurantRegistrationDetailView.as_view(), name='restaurant-registration-detail'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),  

    # API quản lý tài khoản admin
    path('admins/', AdminAccountListView.as_view(), name='admin-list'),           # GET (list), POST (create)
    path('admins/<int:pk>/', AdminAccountDetailView.as_view(), name='admin-detail'), # GET, PATCH, DELETE
]
