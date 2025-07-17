from rest_framework.generics import ListAPIView
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class RestaurantListView(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class DishByRestaurantView(APIView):
    def get(self, request, restaurant_id):
        dishes = Dish.objects.filter(restaurant_id=restaurant_id)
        serializer = DishSerializer(dishes, many=True)
        return Response(serializer.data)
