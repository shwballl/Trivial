from rest_framework import serializers

from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer for registration.
    
    Fields:
        id (int): Unique identifier of the user.
        name (str): Name of the user.
        email (str): Email of the user.
        password (str): Password of the user.
    """
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        """
        Creates a new user instance.
        
        Args:
            validated_data (dict): Validated data from the request.
        
        Returns:
            User: The newly created user instance.
        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance        


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    User serializer for updating user information.
    
    Fields:
        name (str): Name of the user.
        about_me (str): About me section of the user.
        socials (dict): Social media links of the user.
    """
    class Meta:
        model = User
        fields = ('name', 'about_me', 'socials')    


class UserLoginSerializer(serializers.Serializer):
    """
    User serializer for logging in.
    
    Fields:
        email (str): Email of the user.
        password (str): Password of the user.
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    
    class Meta:
        model = User
        fields = ('email', 'password')


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User serializer for the user profile.
    
    Fields:
        id (int): Unique identifier of the user.
        name (str): Name of the user.
        email (str): Email of the user.
        rating (int): Rating of the user.
        image (str): Profile image of the user.
        created_tasks (list): List of created tasks of the user.
        completed_tasks (list): List of completed tasks of the user.
        about_me (str): About me section of the user.
        socials (dict): Social media links of the user.
    """
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'rating', 'image', 'created_tasks', 'completed_tasks', 'about_me', 'socials')
        

class VerifyEmailSerializer(serializers.Serializer):
    """
    User serializer for verifying email.
    
    Fields:
        email (str): Email of the user.
        code (str): Verification code.
    """
    email = serializers.EmailField()
    code = serializers.CharField()

