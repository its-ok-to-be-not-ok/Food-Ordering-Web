from rest_framework import serializers
from .models import Order, OrderItem, Delivery, Payment
from restaurants.models import MenuItem, Restaurant
from restaurants.serializers import MenuItemSerializer, RestaurantSerializer
from users.serializers import UserSerializer
from django.shortcuts import get_object_or_404

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['id', 'shipper_info', 'delivery_status', 'estimated_time']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'amount', 'status', 'payment_date', 'transaction_code']
        read_only_fields = ['id', 'payment_date', 'transaction_code']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_id', 'quantity', 'price', 'note']

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    restaurant = RestaurantSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    delivery = DeliverySerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'restaurant', 'order_date', 'status', 'total_amount', 
                 'payment_status', 'items', 'delivery', 'payment']

class OrderCreateSerializer(serializers.Serializer):
    restaurant_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=['cash', 'card', 'momo', 'zalopay', 'bank_transfer'])
    items = OrderItemSerializer(many=True)

    def validate(self, data):
        restaurant = get_object_or_404(Restaurant, id=data['restaurant_id'])
        total_amount = 0
        
        for item_data in data['items']:
            menu_item = get_object_or_404(MenuItem, id=item_data['menu_item_id'])
            if menu_item.menu.restaurant.id != restaurant.id:
                raise serializers.ValidationError("Tất cả món phải thuộc cùng 1 nhà hàng")
            
            price = menu_item.price - menu_item.discount
            item_data['price'] = price
            total_amount += price * item_data['quantity']
            
        data['total_amount'] = total_amount
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        payment_method = validated_data.pop('payment_method')
        
        order = Order.objects.create(
            user=user,
            restaurant_id=validated_data['restaurant_id'],
            total_amount=validated_data['total_amount']
        )
        
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                **item_data
            )
        
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=validated_data['total_amount'],
            transaction_code=f"TXN_{order.id}_{order.order_date.strftime('%Y%m%d%H%M%S')}"
        )
        
        return order
