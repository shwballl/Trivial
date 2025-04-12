from django.contrib import admin

from apps.tasks.models import Task

# Register your models here.
admin.site.register(Task)