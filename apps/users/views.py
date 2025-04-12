from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.users.models import User
from apps.users.utils import get_user_from_cookie
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
import jwt
from datetime import datetime, timedelta

from apps.users.serializers import UserSerializer, UserLoginSerializer

class RegisterAPIView(APIView):
    @extend_schema(
        summary="User register",
        description="User register",
        request=UserSerializer,
        responses=UserSerializer
    )
    def post(self, request):
        serializer_class = UserSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response({"status": "User register success"}, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    @extend_schema(
        summary="User login",
        description="User login",
        request=UserLoginSerializer,
        responses={
            200: OpenApiResponse(description="User login success"),
            401: OpenApiResponse(description="Invalid password"),
            404: OpenApiResponse(description="User with this email not found")
        }
    )
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"status": "User with this email not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.check_password(password):
            return Response({"status": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        payload = {
            'id': user.id,
            'email': user.email,
            'exp': datetime.now() + timedelta(minutes=60),
            'iat': datetime.now()
        }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        response = Response()
        
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {'jwt': token}
        
        return response
    
class LogoutAPIView(APIView):
    @extend_schema(
        summary="User logout",
        description="User logout",
        responses={
            200: OpenApiResponse(description="User logout success"),
        }
    )
    def post(self, request):
        response = Response()
        response.delete_cookie(key='jwt')
        response.data = {'message': 'success'}
        response.status_code = 200
        return response

class DeleteUserAPIView(APIView):
    @extend_schema(
        summary="User delete",
        description="User delete",
        responses={
            200: OpenApiResponse(description="User delete success"),
        }
    )
    def delete(self, request):
        user = get_user_from_cookie(request=request)
        user.delete()
        return Response({"status": "User delete success"}, status=status.HTTP_200_OK)