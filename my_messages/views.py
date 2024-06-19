from django.shortcuts import render, get_object_or_404, redirect
from chat.models import Message, Chat
from django.contrib.auth.models import User
from django.db.models import Q

def my_messages(request):
    user = request.user
    chats = Chat.objects.filter(Q(user1=user) | Q(user2=user))
    if request.method == 'POST' and chats:
        if request.POST.get('delete'):
            chat_id = request.POST.get('delete')
            chat = Chat.objects.get(id = chat_id)
            chat.delete()
            return redirect('my_messages')

    return render(request, 'my_messages/my_messages.html', context={'all_messages': chats})