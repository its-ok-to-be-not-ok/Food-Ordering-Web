from rest_framework import serializers
from .models import Restaurant, Menu, MenuItem, RestaurantStat, MenuItemStat
from users.serializers import UserSerializer

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'image', 'status', 'category', 'discount']

class MenuSerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Menu
        fields = ['id', 'title', 'description', 'items']

class RestaurantSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    menus = MenuSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'name', 'address', 'phone', 'email', 'description', 
                 'status', 'rating', 'registered_date', 'menus']
        read_only_fields = ['id', 'rating', 'registered_date']

class RestaurantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['name', 'address', 'phone', 'email', 'description']

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
