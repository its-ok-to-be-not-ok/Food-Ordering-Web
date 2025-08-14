from django.db import models


CATEGORY_CHOICES = [
    ('com', 'Cơm'),
    ('lau', 'Lẩu'),
    ('bun', 'Bún'),
    ('pho', 'Phở'),
    ('mi', 'Mì'),
    ('chien_ran', 'Chiên rán'),
    ('nuong', 'Nướng'),
    ('hai_san', 'Hải sản'),
    ('an_vat', 'Ăn vặt'),
    ('do_uong', 'Đồ uống'),
    ('chay', 'Chay'),
    ('han_quoc', 'Hàn Quốc'),
    ('nhat_ban', 'Nhật Bản'),
    ('tay', 'Món Tây'),
    ('khac', 'Khác'),
]


class Restaurant(models.Model):
    STATUS_CHOICES = [
        ('active', 'Hoạt động'),
        ('inactive', 'Không hoạt động'),
        ('suspended', 'Tạm ngưng'),
    ]
    
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    rating = models.FloatField(default=0.0)
    registered_date = models.DateTimeField(auto_now_add=True)
    categories = models.JSONField(default=list)
    images = models.JSONField(default=list, blank=True, null=True)  

    def __str__(self):
        return self.name


class Menu(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menus')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.title}"


class MenuItem(models.Model):
    STATUS_CHOICES = [
        ('available', 'Còn hàng'),
        ('out_of_stock', 'Hết hàng'),
        ('discontinued', 'Ngừng bán'),
    ]
    
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    category = models.CharField(max_length=50)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    image = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class RestaurantStat(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='stats')
    total_orders = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    average_rating = models.FloatField(default=0.0)
    stats_date = models.DateField()
    
    class Meta:
        unique_together = ['restaurant', 'stats_date']
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.stats_date}"


class MenuItemStat(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='stats')
    total_sold = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    average_rating = models.FloatField(default=0.0)
    stats_date = models.DateField()
    
    class Meta:
        unique_together = ['menu_item', 'stats_date']
    
    def __str__(self):
        return f"{self.menu_item.name} - {self.stats_date}"
