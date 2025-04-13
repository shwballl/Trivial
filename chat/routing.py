from django.urls import path
from .consumers import ChatCosumer

ws_pattern = [
    path("ws/room/<int:room_id>/", ChatCosumer.as_asgi()),
]