from datetime import datetime
from django.db import models

from apps.users.models import User

class Task(models.Model):
    CATEGORIES = {
        "web": "web", "text": "text", "video": "video", "image": "image", "design": "design", "programming": "programming", "other": "other", "all": "all"
    }
    
    
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    category = models.CharField(max_length=20, choices=CATEGORIES, default="OTHER")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    
    class Meta:
        db_table = "tasks"
        ordering = ["-created_at"]
        
    def save(self, *args, **kwargs):
        if self.expires_at == datetime.now():
            self.is_completed = True
        return super(Task, self).save(*args, **kwargs)
    

    def __str__(self):
        return self.title