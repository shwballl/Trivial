from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and returns a user with the given email and password.
        
        Args:
            email (str): The email address of the user. Must be provided.
            password (str, optional): The password for the user. Defaults to None.
            **extra_fields: Additional fields for the user model.
        
        Raises:
            ValueError: If the email is not provided.
        
        Returns:
            user: The created user instance.
        """

        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)  # fallback
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and returns a superuser with the given email and password.

        This method sets the user as a staff member, superuser, and active by default. 
        It raises a ValueError if 'is_staff' or 'is_superuser' are not set to True.

        Args:
            email (str): The email address of the user. Must be provided.
            password (str, optional): The password for the user. Defaults to None.
            **extra_fields: Additional fields for the user model.

        Raises:
            ValueError: If 'is_staff' or 'is_superuser' are not True.
        
        Returns:
            user: The created superuser instance.
        """

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)
