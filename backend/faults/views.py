from rest_framework import generics, permissions
from .models import Fault
from .serializers import FaultSerializer

class FaultListCreateView(generics.ListCreateAPIView):
    queryset = Fault.objects.all().order_by('-created_at')
    serializer_class = FaultSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class FaultByRestaurantView(generics.ListAPIView):
    serializer_class = FaultSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        restaurant_id = self.kwargs.get("restaurant_id")
        return Fault.objects.filter(restaurant_id=restaurant_id).order_by('-created_at')

class FaultAdminListView(generics.ListAPIView):
    queryset = Fault.objects.all().order_by('-created_at')
    serializer_class = FaultSerializer
    permission_classes = [permissions.IsAdminUser]