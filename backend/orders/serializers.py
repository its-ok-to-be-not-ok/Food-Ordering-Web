class OrderItemSerializer(serializers.Serializer):
    dish_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    restaurant_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=["cash", "card", "momo"])
    items = OrderItemSerializer(many=True)

    def validate(self, data):
        restaurant = get_object_or_404(Restaurant, id=data['restaurant_id'])
        total_price = 0
        for item in data['items']:
            dish = get_object_or_404(Dish, id=item['dish_id'])
            if dish.restaurant_id != restaurant.id:
                raise serializers.ValidationError("Tất cả món phải thuộc cùng 1 nhà hàng")
            total_price += (dish.price - dish.discount) * item['quantity']
        data['total_price'] = total_price
        return data

    def create(self, validated_data):
        customer = self.context['request'].user
        order = Order.objects.create(
            customer=customer,
            restaurant_id=validated_data['restaurant_id'],
            payment_method=validated_data['payment_method'],
            total_price=validated_data['total_price'],
        )
        for item in validated_data['items']:
            OrderItem.objects.create(
                order=order,
                dish_id=item['dish_id'],
                quantity=item['quantity']
            )
        return order
