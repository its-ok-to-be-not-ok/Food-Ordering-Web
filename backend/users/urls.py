from django.urls import path
from .views import (
    GetAllPendingRegistrationsView, RegisterView, LoginView, UserProfileView,
    RestaurantRegistrationView, RestaurantRegistrationListView,
    RestaurantRegistrationDetailView, AdminLoginView,
    AdminAccountListView, AdminAccountDetailView, RestaurantRegistrationStatusUpdateView,
    SearchUserByContactView, BanUserView, DeleteUserView, UnbanUserView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('registrations/', RestaurantRegistrationListView.as_view(), name='restaurant-registrations'),
    path('registrations/<int:pk>/', RestaurantRegistrationDetailView.as_view(), name='restaurant-registration-detail'),
    path('registrations/<int:pk>/status/', RestaurantRegistrationStatusUpdateView.as_view(), name='restaurant-registration-status'),
    path('registrations/pending/', GetAllPendingRegistrationsView.as_view(), name='restaurant-registrations-pending'),
    # path('registrations/<int:pk>/', RestaurantRegistrationStatusUpdateView.as_view(), name='restaurant-registration-update'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),  

    # API quản lý tài khoản admin
    path('admins/', AdminAccountListView.as_view(), name='admin-list'),           # GET (list), POST (create)
    path('admins/<int:pk>/', AdminAccountDetailView.as_view(), name='admin-detail'), # GET, PATCH, DELETE

    path('search/', SearchUserByContactView.as_view(), name='user-search'),
    path('<int:pk>/ban-restaurants/', BanUserView.as_view(), name='user-ban-restaurants'),
    path('<int:pk>/unban-restaurants/', UnbanUserView.as_view(), name='user-unban-restaurants'),
    path('<int:pk>/', DeleteUserView.as_view(), name='user-delete'),
    
]
