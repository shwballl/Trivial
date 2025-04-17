
from django.urls import path
from .views import DeleteUserAPIView, LoginAPIView, LogoutAPIView, RegisterAPIView, UserAPIView, UserProfileAPIView, UserUpdateAPIView, VerifyEmailAPIView, UserProfileRatingAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', LoginAPIView.as_view(), name='login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
    path('auth/verify/', VerifyEmailAPIView.as_view(), name='verify'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserAPIView.as_view(), name='user'),
    
    path('auth/delete/', DeleteUserAPIView.as_view(), name='delete'),
    path('profile/', UserUpdateAPIView.as_view(), name='update'),
    path('profile/<int:user_id>/', UserProfileAPIView.as_view(), name='profile'),
    path('profile/set-rating-for-user/<int:user_id>/<int:rating>/<int:operation>/', UserProfileRatingAPIView.as_view(), name='set-rating'),
]
