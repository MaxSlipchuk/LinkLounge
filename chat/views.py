from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import Chat, Message


def chat_with_user(request, user_id):
    user1 = request.user
    user2 = get_object_or_404(User, id=user_id)
    
    # Перевірка, чи існує чат
    chat = Chat.objects.filter(user1=user1, user2=user2).first() or Chat.objects.filter(user1=user2, user2=user1).first()
    
    if not chat:
        chat = Chat.objects.create(user1=user1, user2=user2)
    return redirect('chat_detail', chat_id=chat.id)

def chat_detail(request, chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    
    if request.method == 'POST':
        message = request.POST.get('message')
        if message:
            Message.objects.create(chat=chat, sender=request.user, message=message)
    
    messages = chat.messages.all()
    return render(request, 'chat/chat_detail.html', {'chat': chat, 'messages': messages})