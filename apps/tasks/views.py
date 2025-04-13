from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics


from apps.tasks.models import CreatedTask, TakedTask
from apps.tasks.serializers import TakeTaskSerializer, TaskCreateSerializer, TaskSerializer, TaskDetailSerializer
from apps.users.utils import get_user_from_cookie

class TasksAPIView(APIView):
    @extend_schema(
        summary="User's Task list",
        description="List of User's tasks.",
        responses={
            200: OpenApiResponse(description="Task list"),
        }
    )
    def get(self, request):
        user = get_user_from_cookie(request=request)
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        queryset = CreatedTask.objects.filter(creator=user).all()
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
        user.created_tasks += 1
        user.save()
        serializer_class = TaskCreateSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save(creator=user)
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
        task = CreatedTask.objects.filter(creator=user).filter(id=task_id).first()
        
        if not task:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        task.delete()
        return Response({"status": "Task deleted success"}, status=status.HTTP_204_NO_CONTENT)


@extend_schema(summary="All Created Tasks", description="List of All Created Tasks")
class TaskListView(generics.ListAPIView):
    queryset = CreatedTask.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['title', 'is_completed', 'category']
    

class TasksDetailAPIView(APIView):
    @extend_schema(
        summary="Task detail",
        description="Task detail",
        responses={
            200: OpenApiResponse(description="Task detail"),
        }
    )
    def get(self, request, task_id):
        task = CreatedTask.objects.filter(id=task_id).first()
        
        if not task:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer_class = TaskDetailSerializer(task)
        return Response({"task": serializer_class.data}, status=status.HTTP_200_OK)


class TasksTakeAPIView(APIView):
    @extend_schema(
        summary="Take Task",
        description="Take Task",
        request=TakeTaskSerializer,
        responses={
            200: OpenApiResponse(description="Task taken success"),
        }    
    )
    def post(self, request, task_id):
        user = get_user_from_cookie(request=request)
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        task = CreatedTask.objects.get(id=task_id)
    
        if not task:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        taked_task = TakedTask.objects.create(task=task, executor=user)
        taked_task.save()
                
        return Response({"status": "Task taken success"}, status=status.HTTP_200_OK)

class TakenTasksAPIView(APIView):
    @extend_schema(
        summary="Taken Task list",
        description="List of User's taken tasks.",
        responses={
            200: OpenApiResponse(description="Taken Tasks list"),
        }
    )
    def get(self, request):
        user = get_user_from_cookie(request=request)
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        taken_tasks = TakedTask.objects.filter(executor=user).all()
        quertset = CreatedTask.objects.filter(id__in=taken_tasks).all()
        serializer_class = TaskSerializer(quertset, many=True)
        return Response({"taken_tasks": serializer_class.data}, status=status.HTTP_200_OK)

class CloseTakenTaskAPIView(APIView):
    @extend_schema(
        summary="Close Taken Task",
        description="Close Taken Task",
        request=TakeTaskSerializer,
        responses={
            200: OpenApiResponse(description="Task closed success"),
        }    
    )
    def post(self, request, task_id):
        user = get_user_from_cookie(request=request)
        user.completed_tasks += 1
        user.save()
        
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            task = TakedTask.objects.get(id=task_id)
        except TakedTask.DoesNotExist:
            return Response({"status": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        
        task.close()
        return Response({"status": "Task closed success"}, status=status.HTTP_200_OK)
    