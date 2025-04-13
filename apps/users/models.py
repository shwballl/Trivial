from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.users.managers import CustomUserManager


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    username = models.CharField(max_length=30, null=True, blank=True, default=None)
    name = models.CharField(max_length=30, null=True, blank=True, default=None)
    rating = models.IntegerField(default=0)
    image = models.ImageField(null=True, blank=True, default=None)
    created_tasks = models.IntegerField(default=0)
    completed_tasks = models.IntegerField(default=0)
    about_me = models.TextField(null=True, blank=True, default=None)
    socials = models.JSONField(null=True, blank=True, default=None)
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["name"]

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
        
    def add_rating(self, rating):
        self.rating += rating
    def substract_rating(self, rating):
        self.rating -= rating