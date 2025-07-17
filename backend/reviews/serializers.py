class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['restaurant', 'rating', 'comment']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating phải từ 1 đến 5")
        return value

    def validate(self, data):
        user = self.context['request'].user
        if Review.objects.filter(restaurant=data['restaurant'], customer=user).exists():
            raise serializers.ValidationError("Bạn đã đánh giá nhà hàng này rồi")
        return data

    def create(self, validated_data):
        return Review.objects.create(
            customer=self.context['request'].user,
            **validated_data
        )
