from rest_framework import serializers

from apps.tasks.models import CreatedTask
from apps.users.serializers import UserProfileSerializer


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for CreatedTask model.
    """
    
    creator = UserProfileSerializer()
    class Meta:
        model = CreatedTask
        fields = ['id','title', 'description', 'is_completed', 'expires_at', 'category', 'price', 'creator']
    
    
class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new CreatedTask.
    """
    class Meta:
        model = CreatedTask
        fields = ['title', 'description', 'category', 'price', 'expires_at']
        
class TaskDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for a detailed view of a CreatedTask.
    """
    creator = UserProfileSerializer()
    class Meta:
        model = CreatedTask
        fields = ['id', 'title', 'description', 'is_completed', 'created_at' ,'expires_at', 'category', 'price', 'creator']

class TakeTaskSerializer(serializers.ModelSerializer):
    """
    Serializer for taking a task.
    """
    class Meta:
        model = CreatedTask
        fields = ['id']
