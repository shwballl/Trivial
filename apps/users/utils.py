import jwt
from rest_framework import status
from rest_framework.response import Response

from apps.users.models import User

def get_user_from_cookie(*, request) -> User:
    token = request.COOKIES.get('jwt')

    if not token:
        return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({"status": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.filter(id=payload['id']).first()
    
    return user