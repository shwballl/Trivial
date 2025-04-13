import jwt
import random
from django.core.mail import EmailMultiAlternatives

from apps.users.models import User


def get_user_from_cookie(*, request: object) -> User:
    """
    Get user from jwt token in cookies.

    Args:
        request: django request object

    Returns:
        User instance if token is valid, None otherwise
    """
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


def generate_code() -> str:
    """
    Generate a 6 digit random code.

    Returns:
        str: 6 digit random code
    """
    return str(random.randint(100000, 999999))


def send_verification_email(user: User) -> None:
    """
    Send verification email to user.

    Args:
        user: User instance
    """
    code = generate_code()
    user.verification_code = code
    user.save()

    subject = 'Your verification code!'
    from_email = 'trivial6@gmail.com'
    to_email = user.email

    # HTML and plain text versions
    html_content = f"""
        <html>
        <body>
            <h2>Hello, {user.email}!</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #4CAF50;">{code}</h1>
        </body>
        </html>
    """
    text_content = f"Hello, {user.email}! Your verification code is: {code}"

    # Construct message
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

