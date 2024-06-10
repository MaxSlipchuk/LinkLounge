from django.shortcuts import render, get_object_or_404
from chat.models import Message, Chat
from django.contrib.auth.models import User
from django.db.models import Q

def my_messages(request):
    user = request.user
    chats = Chat.objects.filter(Q(user1=user) | Q(user2=user))
    return render(request, 'my_messages/my_messages.html', context={'all_messages': chats})