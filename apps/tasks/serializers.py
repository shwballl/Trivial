from rest_framework import serializers

from apps.tasks.models import CreatedTask
from apps.users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedTask
        fields = ['id','title', 'description', 'is_completed', 'expires_at', 'category', 'price', 'creator']
    
    
class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedTask
        fields = ['title', 'description', 'category', 'price', 'expires_at']
        
class TaskDetailSerializer(serializers.ModelSerializer):
    creator = UserSerializer()
    class Meta:
        model = CreatedTask
        fields = ['id', 'title', 'description', 'is_completed', 'created_at' ,'expires_at', 'category', 'price', 'creator']

class TakeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatedTask
        fields = ['id']