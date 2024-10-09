from django.shortcuts import render, redirect
from chat.models import Chat
from django.db.models import Q
# використовується для створення складних запитів з логічними операторами (AND, OR, NOT).
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.http import JsonResponse

@login_required
def my_messages(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
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
    if is_ajax:
        html = render_to_string('my_messages/partial_content.html', {'all_messages': chats}, request=request)
        print('my mesagges ajax')
        return JsonResponse({'html': html}) 
    else:
        print('my mesagges respounse')
        return render(request, 'my_messages/my_messages.html', {'all_messages': chats})