from django.shortcuts import render, redirect

from apps.users.utils import get_user_from_cookie
from chat.models import Room, Message

def ChatView(request):
    """
    Handle chat room creation or retrieval based on POST request.

    If a POST request is made with a 'room_id', attempt to retrieve the
    corresponding chat room. If it does not exist, create a new room
    with the given ID. Redirect the user to the chat room.

    For GET requests, render the chat room entry page.

    Args:
        request: The HTTP request object.

    Returns:
        HttpResponse: Redirects to the chat room if a valid 'room_id' is provided.
        Otherwise, renders the chat.html template.
    """
    if request.method == 'POST':
        room_id = request.POST.get('room_id')

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            room = Room.objects.create(id=room_id, name=f"Room {room_id}")

        return redirect('room', room_id=room.id)

    return render(request, 'chat.html')

def RoomView(request, room_id):
    """
    Render a chat room with messages for a specific user.

    Retrieve the user from the request cookie and the room by 'room_id'.
    If the user is not authenticated, redirect to the login page.
    Otherwise, fetch messages for the room and user, and render the room.html template.

    Args:
        request: The HTTP request object.
        room_id: The ID of the chat room to retrieve.

    Returns:
        HttpResponse: Redirects to login if user is not authenticated.
        Otherwise, renders the room.html template with room messages.
    """
    user = get_user_from_cookie(request=request)
    existing_room = Room.objects.get(id=room_id)
    
    if not user:
        return redirect('login')
    
    get_messages = Message.objects.filter(room=existing_room, user=user).all()
    context = {
        'messages': get_messages,
        'room_id': room_id,
        'user': user.name,
    }
    return render(request, 'room.html', context)
