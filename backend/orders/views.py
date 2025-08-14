from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem, Delivery, Payment
from .serializers import OrderSerializer, OrderCreateSerializer, DeliverySerializer, PaymentSerializer

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        elif user.role == 'restaurant_owner':
            return Order.objects.filter(restaurant__owner=user)
        else:
            return Order.objects.filter(user=user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        elif user.role == 'restaurant_owner':
            return Order.objects.filter(restaurant__owner=user)
        else:
            return Order.objects.filter(user=user)

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            order = serializer.save()
            return Response({
                "message": "Đặt hàng thành công", 
                "order": OrderSerializer(order ).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        
        if request.user.role == 'restaurant_owner' and order.restaurant.owner != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'customer' and order.user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response({'message': 'Order status updated successfully'})
        
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-order_date')

class RestaurantOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'restaurant_owner':
            return Order.objects.none()
        
        restaurant_id = self.kwargs.get('restaurant_id')
        return Order.objects.filter(
            restaurant_id=restaurant_id,
            restaurant__owner=self.request.user
        ).order_by('-order_date')

class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, order_id):
        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Không tìm thấy đơn hàng."}, status=status.HTTP_404_NOT_FOUND)
        if order.status != "pending":
            return Response({"detail": "Chỉ có thể huỷ đơn hàng khi đang chờ xác nhận."}, status=status.HTTP_400_BAD_REQUEST)
        order.delete()
        return Response({"detail": "Đã huỷ đơn hàng."}, status=status.HTTP_204_NO_CONTENT)