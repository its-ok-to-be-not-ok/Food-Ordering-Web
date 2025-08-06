from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Admin, RestaurantRegistration
from .serializers import (
    UserSerializer, RegisterSerializer, AdminSerializer,
    RestaurantRegistrationSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class RestaurantRegistrationView(generics.CreateAPIView):
    serializer_class = RestaurantRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RestaurantRegistrationListView(generics.ListAPIView):
    serializer_class = RestaurantRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = RestaurantRegistration.objects.all()
        if self.request.user.role != 'admin':
            qs = qs.filter(user=self.request.user)
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.order_by("-registration_date")

class RestaurantRegistrationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = RestaurantRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = RestaurantRegistration.objects.all()
        if self.request.user.role != 'admin':
            qs = qs.filter(user=self.request.user)