from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Admin, RestaurantRegistration
from restaurants.models import Restaurant
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

class RestaurantRegistrationStatusUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            registration = RestaurantRegistration.objects.get(pk=pk)
        except RestaurantRegistration.DoesNotExist:
            return Response({"error": "Không tìm thấy đăng ký."}, status=status.HTTP_404_NOT_FOUND)
        status_val = request.data.get("status")
        if status_val in ["approved", "rejected"]:
            registration.status = status_val
            registration.save()
            serializer = RestaurantRegistrationSerializer(registration)
            return Response(serializer.data)
        return Response({"error": "Trạng thái không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)
    
class GetAllPendingRegistrationsView(generics.ListAPIView):
    queryset = RestaurantRegistration.objects.filter(status="pending")
    serializer_class = RestaurantRegistrationSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if email and password:
            try:
                user = User.objects.get(email=email, is_staff=True)
            except User.DoesNotExist:
                return Response({'error': 'Tài khoản admin không tồn tại hoặc không có quyền.'}, status=status.HTTP_401_UNAUTHORIZED)
            user = authenticate(username=email, password=password)
            if user and user.is_staff:
                refresh = RefreshToken.for_user(user)
                admin_obj = Admin.objects.filter(user=user).first()
                permissions = admin_obj.get_permissions_display() if admin_obj else ""
                return Response({
                    'user': UserSerializer(user).data,
                    'permissions': permissions,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Sai mật khẩu hoặc tài khoản không hợp lệ.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Email và password là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

class AdminAccountListView(generics.ListCreateAPIView):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        users = self.get_queryset()
        data = []
        for user in users:
            admin_obj = Admin.objects.filter(user=user).first()
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "permissions": admin_obj.get_permissions_display() if admin_obj else "",
            })
        return Response(data)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_staff=True, is_superuser=True, role="admin")
        user.set_password(data["password"])
        user.save()
        admin_obj = Admin.objects.create(user=user, permissions=data.get("permissions", ""))
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "permissions": admin_obj.get_permissions_display(),
        }, status=status.HTTP_201_CREATED)

class AdminAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        admin_obj = Admin.objects.filter(user=user).first()
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "permissions": admin_obj.get_permissions_display() if admin_obj else "",
        }
        return Response(data)

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        admin_obj, _ = Admin.objects.get_or_create(user=user)
        permissions_val = request.data.get("permissions")
        if permissions_val is not None:
            admin_obj.permissions = permissions_val
            admin_obj.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "permissions": admin_obj.get_permissions_display(),
        })

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        Admin.objects.filter(user=user).delete()
        user.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)
    
class SearchUserByContactView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        contact = request.query_params.get("contact")
        if not contact:
            return Response({"error": "Thiếu thông tin tìm kiếm."}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(
            email__iexact=contact
        ).first() or User.objects.filter(
            phone__iexact=contact
        ).first()
        if not user:
            return Response({"error": "Không tìm thấy user."}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user).data)

class BanUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy user."}, status=status.HTTP_404_NOT_FOUND)
        user.status = "banned"
        user.save()
        return Response({"success": True})

class UnbanUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy user."}, status=status.HTTP_404_NOT_FOUND)
        user.status = "active"
        user.save()
        return Response({"success": True})

class DeleteUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy user."}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)