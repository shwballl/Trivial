from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from apps.tasks.models import Task
from apps.tasks.serializers import TaskCreateSerializer, TaskSerializer, TaskDetailSerializer
from apps.users.utils import get_user_from_cookie

class TasksAPIView(APIView):
    @extend_schema(
        summary="Task list",
        description="List of User's tasks.",
        responses={
            200: OpenApiResponse(description="Task list"),
        }
    )
    def get(self, request):
        user = get_user_from_cookie(request=request)
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        queryset = Task.objects.filter(user=user).all()
        serializer_class = TaskSerializer(queryset, many=True)
        return Response({"tasks": serializer_class.data}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Create Task",
        description="Create Task",
        request=TaskCreateSerializer,
        responses={
            201: OpenApiResponse(description="Task created success"),
        }
    )
    def post(self, request):
        user = get_user_from_cookie(request=request)
        serializer_class = TaskCreateSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save(user=user)
        return Response({"status": "Task created success", "task": serializer_class.data}, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        summary="Delete Task",
        description="Delete Task",
        request={
            "task_id": OpenApiParameter(
                name="task_id",
                description="Task ID",
                location=OpenApiParameter.PATH
        )},
        parameters=[
            OpenApiParameter(
                name="task_id",
                description="Task ID",
                location=OpenApiParameter.QUERY
            )
        ],
        responses={
            200: OpenApiResponse(description="Task deleted success"),
        }
    )
    def delete(self, request):
        user = get_user_from_cookie(request=request)
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        task_id = request.data.get("task_id") if request.data.get("task_id") else request.query_params.get("task_id")
        task = Task.objects.filter(user=user).filter(id=task_id).first()
        
        if not task:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        task.delete()
        return Response({"status": "Task deleted success"}, status=status.HTTP_204_NO_CONTENT)


class AllTasksAPIView(APIView):
    @extend_schema(
        summary="Task list",
        description="List of all tasks.",
        responses={
            200: OpenApiResponse(description="Task list"),
        }
    )
    def get(self, request):
        queryset = Task.objects.all()
        category = request.query_params.get('category')
        
        if category in Task.CATEGORIES:
            queryset = queryset.filter(category=category)
        
        serializer_class = TaskSerializer(queryset, many=True)
        return Response({"tasks": serializer_class.data}, status=status.HTTP_200_OK)
    

class TasksDetailAPIView(APIView):
    @extend_schema(
        summary="Task detail",
        description="Task detail",
        responses={
            200: OpenApiResponse(description="Task detail"),
        }
    )
    def get(self, request, task_id):
        task = Task.objects.filter(id=task_id).first()
        
        if not task:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer_class = TaskDetailSerializer(task)
        return Response({"task": serializer_class.data}, status=status.HTTP_200_OK)