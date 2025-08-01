from rest_framework import serializers
from .models import User, Admin, RestaurantRegistration

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'role', 'status', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'address', 'role']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email đã tồn tại")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Admin
        fields = ['id', 'user', 'permissions']

class RestaurantRegistrationSerializer(serializers.ModelSerializer):
    # Import động để tránh circular import
    def get_restaurant(self, obj):
        from restaurants.serializers import RestaurantSerializer
        return RestaurantSerializer(obj.restaurant).data if obj.restaurant else None

    restaurant = serializers.SerializerMethodField("get_restaurant")

    class Meta:
        model = RestaurantRegistration
        fields = ["id", "user", "restaurant", "status", "registration_date", "admin_note"]
