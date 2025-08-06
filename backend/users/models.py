from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    
    ROLE_CHOICES = [
        ('customer', 'Khách hàng'),
        ('restaurant_owner', 'Chủ nhà hàng'),
        ('admin', 'Quản trị viên'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Hoạt động'),
        ('inactive', 'Không hoạt động'),
        ('banned', 'Bị cấm'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    permissions = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Admin: {self.user.username}"


class RestaurantRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ duyệt'),
        ('approved', 'Đã duyệt'),
        ('rejected', 'Từ chối'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey("restaurants.Restaurant", on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    registration_date = models.DateTimeField(auto_now_add=True)
    admin_note = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Registration by {self.user.username} - {self.status}"