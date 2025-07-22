from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer
from restaurants.serializers import RestaurantSerializer, MenuItemSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    restaurant = RestaurantSerializer(read_only=True)
    menu_item = MenuItemSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'restaurant', 'menu_item', 'rating', 'comment', 'review_date']
        read_only_fields = ['id', 'user', 'review_date']

class ReviewCreateSerializer(serializers.ModelSerializer):
    restaurant_id = serializers.IntegerField(required=False)
    menu_item_id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Review
        fields = ['restaurant_id', 'menu_item_id', 'rating', 'comment']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating phải từ 1 đến 5")
        return value

    def validate(self, data):
        
        if not data.get('restaurant_id') and not data.get('menu_item_id'):
            raise serializers.ValidationError("Phải chọn nhà hàng hoặc món ăn để đánh giá")
        
        if data.get('restaurant_id') and data.get('menu_item_id'):
            raise serializers.ValidationError("Chỉ có thể đánh giá nhà hàng hoặc món ăn, không thể cả hai")
        
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        restaurant_id = validated_data.pop('restaurant_id', None)
        menu_item_id = validated_data.pop('menu_item_id', None)
        
        review_data = {
            'user': user,
            **validated_data
        }
        
        if restaurant_id:
            review_data['restaurant_id'] = restaurant_id
        if menu_item_id:
            review_data['menu_item_id'] = menu_item_id
            
        return Review.objects.create(**review_data)
    
