import jwt

from apps.users.models import User

def get_user_from_cookie(*, request) -> User:
    token = request.COOKIES.get('jwt')

    if not token:
        return None
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None

    user = User.objects.filter(id=payload['id']).first()
    
    if not user:
        return None
    
    return user