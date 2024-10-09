from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import Chat, Message
from django.http import HttpResponseForbidden, JsonResponse, HttpResponseNotFound
from django.template.loader import render_to_string

def chat_with_user(request, user_id):
    user1 = request.user
    user2 = get_object_or_404(User, id=user_id)
    chat = Chat.objects.filter(user1=user1, user2=user2).first() or Chat.objects.filter(user1=user2, user2=user1).first()
    if not chat:
        chat = Chat.objects.create(user1=user1, user2=user2)
        print(f'створений чат між {user1} і {user2}')
    return redirect('chat_detail', chat_id=chat.id)

def chat_detail(request, chat_id):
    # is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    chat = get_object_or_404(Chat, id=chat_id)
    if request.user.id not in [chat.user1_id, chat.user2_id]:
        return HttpResponseForbidden("Ви не є учасником цього чату")
    if request.method == 'POST':
        message = request.POST.get('message')
        if message:
            mess = Message.objects.create(chat=chat, sender=request.user, message=message)
            print(mess.message)

    messages = chat.messages.all()
    other_user = chat.user1 if chat.user2 == request.user else chat.user2
    # if is_ajax:
    #     print('зайшлив аякс')
    #     html = render_to_string('chat/partial_content.html', {'chat': chat, 'messages': messages, 'other_user': other_user}, request=request)
    #     return JsonResponse({'html': html}) 
    print('chat respounse') 
    return render(request, 'chat/chat_detail.html', {'chat': chat, 'messages': messages, 'other_user': other_user})