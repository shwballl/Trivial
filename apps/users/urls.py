
from django.urls import path
from .views import DeleteUserAPIView, LoginAPIView, LogoutAPIView, RegisterAPIView, UserProfileAPIView, UserUpdateAPIView, VerifyEmailAPIView, UserProfileRatingAPIView

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', LoginAPIView.as_view(), name='login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='logout'),
    path('auth/verify/', VerifyEmailAPIView.as_view(), name='verify'),
    path('auth/delete/', DeleteUserAPIView.as_view(), name='delete'),
    path('profile/', UserUpdateAPIView.as_view(), name='update'),
    path('profile/<int:user_id>/', UserProfileAPIView.as_view(), name='profile'),
    path('profile/set-rating-for-user/<int:user_id>/<int:rating>/<int:operation>/', UserProfileRatingAPIView.as_view(), name='set-rating'),
]
