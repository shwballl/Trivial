from rest_framework import serializers

from apps.tasks.models import Task
from apps.users.serializers import UserSerializer

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id','title', 'description', 'is_completed', 'expires_at', 'category', 'price', 'user']
    
    
class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'price', 'expires_at']
        
class TaskDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'created_at' ,'expires_at', 'category', 'price', 'user']