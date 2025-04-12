
from django.urls import path
from .views import DeleteUserAPIView, LoginAPIView, LogoutAPIView, RegisterAPIView, UserProfileAPIView, UserUpdateAPIView

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', LoginAPIView.as_view(), name='login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
    path('auth/delete/', DeleteUserAPIView.as_view(), name='delete'),
    path('profile/', UserUpdateAPIView.as_view(), name='update'),
    path('profile/<int:user_id>/', UserProfileAPIView.as_view(), name='profile'),
]
