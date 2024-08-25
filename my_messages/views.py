from django.shortcuts import render, redirect
from chat.models import Chat
from django.db.models import Q
# використовується для створення складних запитів з логічними операторами (AND, OR, NOT).
from django.contrib.auth.decorators import login_required

@login_required
def my_messages(request):
    user = request.user
    # Вибірка чатів, де є хоча б одне повідомлення
    chats = Chat.objects.filter(
        (Q(user1=user) | Q(user2=user)) & 
        Q(messages__isnull=False)
    ).distinct()

    if request.method == 'POST' and chats:
        if request.POST.get('delete'):
            chat_id = request.POST.get('delete')
            chat = Chat.objects.get(id = chat_id)
            chat.delete()
            return redirect('my_messages')

    return render(request, 'my_messages/my_messages.html', context={'all_messages': chats})