from django.urls import path
from .views import RegisterView, LoginView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),  # nếu dùng JWT thì xài `TokenObtainPairView`
    path('me/', ProfileView.as_view()),
]
