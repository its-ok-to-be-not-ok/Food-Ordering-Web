from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.files.storage import default_storage
from django.utils import timezone
from django.core.exceptions import PermissionDenied
import os
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
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if not (self.request.user.is_superuser or obj.owner == self.request.user):
                raise PermissionDenied("Bạn không có quyền sửa/xoá nhà hàng này.")
        return obj

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
        if not (request.user.is_superuser or restaurant.owner == request.user):
            raise PermissionDenied("Bạn không có quyền thêm menu cho nhà hàng này.")
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, menu_id=None):
        menu = get_object_or_404(Menu, id=menu_id)
        if not (request.user.is_superuser or menu.restaurant.owner == request.user):
            raise PermissionDenied("Bạn không có quyền sửa menu này.")
        serializer = MenuSerializer(menu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, menu_id=None):
        menu = get_object_or_404(Menu, id=menu_id)
        if not (request.user.is_superuser or menu.restaurant.owner == request.user):
            raise PermissionDenied("Bạn không có quyền xoá menu này.")
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
        if not (self.request.user.is_superuser or menu.restaurant.owner == self.request.user):
            raise PermissionDenied("Bạn không có quyền thêm món cho menu này.")
        serializer.save(menu=menu)

class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if not (self.request.user.is_superuser or obj.menu.restaurant.owner == self.request.user):
                raise PermissionDenied("Bạn không có quyền sửa/xoá món này.")
        return obj

class RestaurantStatsView(generics.ListAPIView):
    serializer_class = RestaurantStatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        if not (self.request.user.is_superuser or restaurant.owner == self.request.user):
            raise PermissionDenied("Bạn không có quyền xem thống kê nhà hàng này.")
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

class UploadRestaurantImagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        files = request.FILES.getlist("images")
        image_names = []
        restaurant_id = request.data.get("restaurant_id")
        # Sửa: chỉ kiểm tra quyền nếu restaurant_id là số
        if restaurant_id and str(restaurant_id).isdigit():
            restaurant = get_object_or_404(Restaurant, id=restaurant_id)
            if not (request.user.is_superuser or restaurant.owner == request.user):
                raise PermissionDenied("Bạn không có quyền upload ảnh cho nhà hàng này.")
        for file in files:
            ext = file.name.split('.')[-1]
            timestamp = timezone.now().strftime("%Y%m%d%H%M%S%f")
            filename = f"{restaurant_id}_{timestamp}.{ext}"
            save_dir = os.path.join(settings.MEDIA_ROOT, "restaurants")
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join("restaurants", filename)
            full_path = os.path.join(settings.MEDIA_ROOT, save_path)
            with open(full_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            image_names.append(save_path)
        return Response({"images": image_names})
    
class SearchRestaurantsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        approved_ids = RestaurantRegistration.objects.filter(status="approved").values_list("restaurant_id", flat=True)
        restaurants = (
            Restaurant.objects.filter(status='active', id__in=approved_ids, email__icontains=query)
            | Restaurant.objects.filter(status='active', id__in=approved_ids, phone__icontains=query)
            | Restaurant.objects.filter(status='active', id__in=approved_ids, name__icontains=query)
        ).distinct()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

class UserRestaurantListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        if not (request.user.is_superuser or request.user.id == user_id):
            return Response({"error": "Bạn không có quyền truy cập."}, status=status.HTTP_403_FORBIDDEN)
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