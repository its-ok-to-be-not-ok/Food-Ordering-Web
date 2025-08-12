from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Restaurant, Menu, MenuItem, RestaurantStat, MenuItemStat
from users.models import RestaurantRegistration
from .serializers import (
    RestaurantSerializer, RestaurantCreateSerializer,
    MenuSerializer, MenuItemSerializer,
    RestaurantStatSerializer, MenuItemStatSerializer, 
)

class RestaurantListView(generics.ListCreateAPIView):
    queryset = Restaurant.objects.filter(status='active')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RestaurantCreateSerializer
        return RestaurantSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
class RestaurantStatusToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id, owner=request.user)
        new_status = request.data.get("status")
        if new_status not in ["active", "inactive"]:
            return Response({"error": "Trạng thái không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)
        restaurant.status = new_status
        restaurant.save()
        return Response({"success": True, "status": restaurant.status})

class RestaurantDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id, owner=request.user)
        restaurant.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)

class RestaurantMenuView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        menus = Menu.objects.filter(restaurant=restaurant)
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data)

    def post(self, request, restaurant_id):
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, menu_id=None):
        menu = get_object_or_404(Menu, id=menu_id)
        serializer = MenuSerializer(menu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, menu_id=None):
        menu = get_object_or_404(Menu, id=menu_id)
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MenuItemListView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        menu_id = self.kwargs.get('menu_id')
        return MenuItem.objects.filter(menu_id=menu_id)

    def perform_create(self, serializer):
        menu_id = self.kwargs.get('menu_id')
        menu = get_object_or_404(Menu, id=menu_id)
        serializer.save(menu=menu)

class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RestaurantStatsView(generics.ListAPIView):
    serializer_class = RestaurantStatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return RestaurantStat.objects.filter(restaurant_id=restaurant_id)

class PopularRestaurantsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        accepted_restaurant_ids = RestaurantRegistration.objects.filter(status="approved").values_list("restaurant_id", flat=True)
        restaurants = Restaurant.objects.filter(
            status='active',
            id__in=accepted_restaurant_ids
        ).order_by('-rating')[:10]
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

# class SearchRestaurantsView(APIView):
#     def get(self, request):
#         query = request.query_params.get('q', '')
#         restaurants = Restaurant.objects.filter(
#             name__icontains=query,
#             status='active'
#         )
#         serializer = RestaurantSerializer(restaurants, many=True)
#         return Response(serializer.data)
    
class SearchRestaurantsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        restaurants = Restaurant.objects.filter(
            status='active'
        ).filter(
            # Tìm theo email hoặc số điện thoại hoặc tên
            email__icontains=query
        ) | Restaurant.objects.filter(
            status='active',
            phone__icontains=query
        ) | Restaurant.objects.filter(
            status='active',
            name__icontains=query
        )
        # Loại bỏ trùng lặp (nếu có)
        restaurants = restaurants.distinct()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

class UserRestaurantListView(APIView):
    def get(self, request, user_id):
        restaurants = Restaurant.objects.filter(owner__id=user_id).order_by('id')
        serializer = RestaurantSerializer(restaurants, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RestaurantCreateView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = serializer.save(owner=self.request.user)

        RestaurantRegistration.objects.create(
            user=self.request.user,
            restaurant=restaurant,
            status="pending"
        )

class RestaurantBanView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, restaurant_id):
        try:
            restaurant = Restaurant.objects.get(pk=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({"error": "Không tìm thấy nhà hàng."}, status=status.HTTP_404_NOT_FOUND)
        restaurant.status = "banned"
        restaurant.save()
        return Response({"success": True})
    
class RestaurantUnbanView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, restaurant_id):
        try:
            restaurant = Restaurant.objects.get(pk=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({"error": "Không tìm thấy nhà hàng."}, status=status.HTTP_404_NOT_FOUND)
        restaurant.status = "inactive"
        restaurant.save()
        return Response({"success": True})