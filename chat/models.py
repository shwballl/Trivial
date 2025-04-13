from django.db import models

from apps.users.models import User


class Room(models.Model):
    """
    Model for a chat room.
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'rooms'
    
    def __str__(self):
        return self.name


class Message(models.Model):
    """
    Model for a chat message.
    """
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    time_stamp = models.DateTimeField(auto_now_add=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    
    class Meta:
        db_table = 'messages'
    
    def __str__(self):
        return self.content
