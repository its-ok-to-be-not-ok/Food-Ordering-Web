from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer

class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        restaurant_id = self.request.query_params.get('restaurant_id')
        menu_item_id = self.request.query_params.get('menu_item_id')
        
        queryset = Review.objects.all()
        
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        if menu_item_id:
            queryset = queryset.filter(menu_item_id=menu_item_id)
            
        return queryset.order_by('-review_date')

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class RestaurantReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Review.objects.filter(restaurant_id=restaurant_id).order_by('-review_date')

class MenuItemReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        menu_item_id = self.kwargs.get('menu_item_id')
        return Review.objects.filter(menu_item_id=menu_item_id).order_by('-review_date')

class UserReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-review_date')
