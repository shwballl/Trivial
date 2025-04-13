
from django.urls import path

from .views import TasksAPIView, TasksDetailAPIView, TasksTakeAPIView, TakenTasksAPIView, CloseTakenTaskAPIView, TaskListView

urlpatterns = [
    path('me/tasks/', TasksAPIView.as_view(), name='tasks'),
    path('me/taken-tasks/', TakenTasksAPIView.as_view(), name='taken-tasks'),
    path('tasks/close/<int:task_id>/', CloseTakenTaskAPIView.as_view(), name='close-task'),
    path('tasks/<int:task_id>/', TasksDetailAPIView.as_view(), name='tasks'),
    path('tasks/', TaskListView.as_view(), name='all-tasks'),
    path('take-task/<int:task_id>/', TasksTakeAPIView.as_view(), name='take-task'),
]
