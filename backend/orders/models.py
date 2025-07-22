from django.db import models
from users.models import User
from restaurants.models import Restaurant, MenuItem

class Delivery(models.Model):
    STATUS_CHOICES = [
        ('assigned', 'Đã giao cho shipper'),
        ('picking_up', 'Đang lấy hàng'),
        ('in_transit', 'Đang giao'),
        ('delivered', 'Đã giao'),
        ('failed', 'Giao thất bại'),
    ]
    
    shipper_info = models.CharField(max_length=255)
    delivery_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='assigned')
    estimated_time = models.DateTimeField()
    
    def __str__(self):
        return f"Delivery {self.id} - {self.delivery_status}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ xác nhận'),
        ('confirmed', 'Đã xác nhận'),
        ('preparing', 'Đang chuẩn bị'),
        ('ready', 'Sẵn sàng giao'),
        ('delivering', 'Đang giao'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Đã hủy'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Chờ thanh toán'),
        ('paid', 'Đã thanh toán'),
        ('failed', 'Thanh toán thất bại'),
        ('refunded', 'Đã hoàn tiền'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment = models.OneToOneField('Payment', on_delete=models.CASCADE, related_name='order', null=True, blank=True)
    delivery = models.OneToOneField(Delivery, on_delete=models.SET_NULL, null=True, blank=True)    

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Tiền mặt'),
        ('card', 'Thẻ tín dụng'),
        ('momo', 'MoMo'),
        ('zalopay', 'ZaloPay'),
        ('bank_transfer', 'Chuyển khoản'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Chờ xử lý'),
        ('completed', 'Hoàn thành'),
        ('failed', 'Thất bại'),
        ('refunded', 'Đã hoàn tiền'),
    ]
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(auto_now_add=True)
    transaction_code = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return f"Payment {self.transaction_code} - {self.amount}"
