from django.shortcuts import render

def chatPage(request, *args, **kwargs):
    return render(request, "chat/chatPage.html")