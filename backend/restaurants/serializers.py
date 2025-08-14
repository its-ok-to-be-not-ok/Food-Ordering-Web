from rest_framework import serializers
from .models import Restaurant, Menu, MenuItem, RestaurantStat, MenuItemStat
from users.serializers import UserSerializer
from django.utils import timezone
import bleach
from decimal import Decimal

class MenuItemSerializer(serializers.ModelSerializer):
    discounted_price = serializers.SerializerMethodField(read_only=True)

    def get_discounted_price(self, obj):
        if not obj.discount or obj.discount <= 0:
            return obj.price
        discount = obj.discount
        if discount > 100:
            discount = 100
        if discount < 0:
            discount = 0
        # Sửa dòng này:
        return obj.price * (Decimal('1') - Decimal(discount) / Decimal('100'))

    def validate_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_description(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_image(self, value):
        return bleach.clean(value, tags=[], strip=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'image', 'status',
            'category', 'discount', 'discounted_price'
        ]

class MenuSerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    def validate_title(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_description(self, value):
        return bleach.clean(value, tags=[], strip=True)
    
    class Meta:
        model = Menu
        fields = ['id', 'title', 'description', 'items']

class RestaurantSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    menus = MenuSerializer(many=True, read_only=True)
    registered_date = serializers.SerializerMethodField()

    def get_registered_date(self, obj):
        if obj.registered_date:
            return timezone.localtime(obj.registered_date).strftime("%d/%m/%Y %H:%M")
        return ""

    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'name', 'city', 'address', 'phone', 'email', 'description',
            'status', 'rating', 'categories', 'images', 'registered_date', 'menus'
        ]
        read_only_fields = ['id', 'rating', 'registered_date']

class RestaurantCreateSerializer(serializers.ModelSerializer):
    def validate_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_address(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_phone(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_email(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_description(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_images(self, value):
        cleaned_images = []
        for img in value:
            cleaned_images.append(bleach.clean(img, tags=[], strip=True))
        return cleaned_images

    class Meta:
        model = Restaurant
        fields = [
            'name', 'address', 'phone', 'email', 'description', 'city', 'categories', 'images'
        ]

class RestaurantStatSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)
    
    class Meta:
        model = RestaurantStat
        fields = ['id', 'restaurant', 'total_orders', 'total_revenue', 'average_rating', 'stats_date']

class MenuItemStatSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    
    class Meta:
        model = MenuItemStat
        fields = ['id', 'menu_item', 'total_sold', 'total_revenue', 'average_rating', 'stats_date']