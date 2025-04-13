"""
A consumer for handling WebSocket connections for chat rooms.

The consumer connects to a room (identified by the room_id parameter
in the URL), and broadcasts any messages it receives to all members
of the room.

The consumer also handles sending messages from the room to the
connected clients.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from apps.users.models import User
from .models import Room, Message


class ChatCosumer(AsyncWebsocketConsumer):
    """
    A consumer for handling WebSocket connections for chat rooms.
    """

    async def connect(self):
        """
        Connect to a room (identified by the room_id parameter in the URL).

        This method is called when a WebSocket connection is established.
        """
        self.room_id = f"room_{self.scope['url_route']['kwargs']['room_id']}"
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        
        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnect from a room.

        This method is called when a WebSocket connection is closed.
        """
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        self.close(close_code)

    async def receive(self, text_data):
        """
        Receive a message from the client.

        This method is called when a message is received from the client.
        """
        print("Recieved data")
        data_json = json.loads(text_data)
        print(data_json)
        event = {
            "type": "send_message",
            "message": data_json,
        }
        
        await self.channel_layer.group_send(self.room_id, event)
        
    async def send_message(self, event):
        """
        Send a message from the room to the connected clients.

        This method is called when a message is received from the room.
        """
        print("Sending message")
        data = event["message"]
        await self.create_message(data=data)
        
        response = {
            "user": data["user"],
            "message": data["message"],
        }
        
        await self.send(text_data=json.dumps({"message": response}))
    
    @database_sync_to_async
    def create_message(self, data):
        """
        Create a new message in the database.

        This method is called when a message is received from the room.
        """
        user = User.objects.filter(name=data["user"]).first()
        room = Room.objects.get(id=data["room_id"])
        Message.objects.create(room=room, user=user, content=data["message"])

