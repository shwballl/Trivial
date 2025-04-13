from django.shortcuts import render, redirect

from apps.users.utils import get_user_from_cookie
from chat.models import Room, Message

def ChatView(request):
    if request.method == 'POST':
        room_id = request.POST.get('room_id')

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            room = Room.objects.create(id=room_id, name=f"Room {room_id}")

        return redirect('room', room_id=room.id)

    return render(request, 'chat.html')

def RoomView(request, room_id):   
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