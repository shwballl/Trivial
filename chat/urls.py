from django.urls import path

from .views import ChatView, RoomView

urlpatterns = [
    path('chat/', ChatView, name="chat"),
    path('room/<int:room_id>/', RoomView, name="room"),
]
