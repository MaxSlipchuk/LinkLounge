from django.shortcuts import render
from .models import Message

def chatPage(request, *args, **kwargs):
    # messages = Message.objects.all()
    # context = {
    #     "messages": messages
    # }
    return render(request, "chat/chatPage.html")