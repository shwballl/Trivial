from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.users.managers import CustomUserManager

class User(AbstractUser):
    """
    Custom user model extending AbstractUser.

    Attributes:
        email (EmailField): Unique email for the user.
        username (CharField): Optional username for the user.
        name (CharField): Name of the user.
        rating (IntegerField): User rating.
        image (ImageField): User profile image.
        created_tasks (IntegerField): Number of tasks created by the user.
        completed_tasks (IntegerField): Number of tasks completed by the user.
        about_me (TextField): User's biography.
        socials (JSONField): User's social media links.
        is_verified (BooleanField): Verification status of the user.
        verification_code (CharField): Code for user verification.
    """
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
        """
        Returns string representation of the user.

        Returns:
            str: User's email.
        """
        return self.email

    def save(self, *args, **kwargs):
        """
        Saves the User instance.

        If username is not set, assigns email to username before saving.
        """
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def add_rating(self, rating):
        """
        Adds to the user's rating.

        Args:
            rating (int): Rating to add.
        """
        self.rating += rating

    def substract_rating(self, rating):
        """
        Subtracts from the user's rating.

        Args:
            rating (int): Rating to subtract.
        """
        self.rating -= rating
