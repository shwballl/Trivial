from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.users.models import User
from apps.users.utils import get_user_from_cookie
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
import jwt
from datetime import datetime, timedelta

from apps.users.serializers import UserProfileSerializer, UserSerializer, UserLoginSerializer, UserUpdateSerializer, VerifyEmailSerializer

from apps.users.utils import send_verification_email

class RegisterAPIView(APIView):
    @extend_schema(
        summary="Register user",
        description="Register user",
        request=UserSerializer,
        responses={
            201: OpenApiResponse(description="User registered successfully"),
        }
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email(user)
        return Response({"status": "Verification code sent to email"}, status=status.HTTP_201_CREATED)


class VerifyEmailAPIView(APIView):
    @extend_schema(
        summary="Verify email",
        description="Verify email",
        request=VerifyEmailSerializer,
        responses={
            200: OpenApiResponse(description="Email verified successfully"),
            400: OpenApiResponse(description="Invalid verification code"),
            404: OpenApiResponse(description="User not found"),
        }
    )
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        if user.verification_code != code:
            return Response({"error": "Invalid verification code"}, status=400)

        user.is_verified = True
        user.verification_code = None
        user.save()

        return Response({"status": "Email verified successfully"}, status=200)


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
        password = request.data.get("password")
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"status": "User with this email not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.is_verified:
            return Response({"status": "User is not verified"}, status=status.HTTP_401_UNAUTHORIZED)
        
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
        response.data = {'status': 'success', 'jwt': token}
        
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
        try:
            response.delete_cookie(key='jwt')
        except:
            return Response({"status": "error"}, status=status.HTTP_401_UNAUTHORIZED)
        response.data = {'status': 'success'}
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
        return Response({"status": "success"}, status=status.HTTP_200_OK)


class UserProfileAPIView(APIView):
    @extend_schema(
        summary="User profile",
        description="User profile",
        responses={
            401: OpenApiResponse(description="Unauthorized"),
            200: OpenApiResponse(description="User profile"),
        }
    )
    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
                
        if not user:
            return Response({"status": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer_class = UserProfileSerializer(user)
        return Response({"user": serializer_class.data}, status=status.HTTP_200_OK)

class UserUpdateAPIView(APIView):
    @extend_schema(
        summary="User update",
        description="User update",
        request=UserUpdateSerializer,
        responses={200: OpenApiResponse(description="User update success")}
    )
    def put(self, request):
        user = get_user_from_cookie(request=request)
                
        if not user:
            return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "User update success"}, status=status.HTTP_200_OK)
