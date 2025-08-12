from rest_framework import serializers
from .models import Fault
from restaurants.models import Restaurant
from users.models import User
from django.utils import timezone

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone']

class RestaurantSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'owner']

class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class FaultSerializer(serializers.ModelSerializer):
    sender = SenderSerializer(read_only=True)
    restaurant = RestaurantSerializer(read_only=True)
    created_at = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        if obj.created_at:
            return timezone.localtime(obj.created_at).strftime("%d/%m/%Y %H:%M")
        return ""

    class Meta:
        model = Fault
        fields = ['id', 'restaurant', 'sender', 'content', 'created_at']