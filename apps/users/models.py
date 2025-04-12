from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.users.managers import CustomUserManager


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    username = models.CharField(max_length=30, null=True, blank=True, default=None)
    name = models.CharField(max_length=30, null=True, blank=True, default=None)


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
