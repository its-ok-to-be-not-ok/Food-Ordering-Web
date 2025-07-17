from rest_framework.generics import ListCreateAPIView
from .models import Review
from .serializers import ReviewSerializer
from rest_framework.permissions import IsAuthenticated

class ReviewListCreateView(ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
