from rest_framework import serializers
from .models import Restaurant, Dish

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'img_url', 'price', 'discount', 'restaurant']

class RestaurantSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'location', 'phone', 'dishes']
