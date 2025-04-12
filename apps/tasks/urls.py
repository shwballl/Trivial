
from django.urls import path

from .views import TasksAPIView, AllTasksAPIView, TasksDetailAPIView

urlpatterns = [
    path('me/tasks/', TasksAPIView.as_view(), name='tasks'),
    path('tasks/<int:task_id>/', TasksDetailAPIView.as_view(), name='tasks'),
    path('tasks/', AllTasksAPIView.as_view(), name='all-tasks'),
]
