from django.contrib import admin

from apps.tasks.models import CreatedTask, TakedTask

# Register your models here.
admin.site.register(CreatedTask)
admin.site.register(TakedTask)