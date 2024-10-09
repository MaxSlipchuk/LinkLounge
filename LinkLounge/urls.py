"""
URL configuration for LinkLounge project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path
import os
from django.http import HttpResponse
from main.views import *
from account.views import *
from app_base.views import *
from all_users.views import *
from chat.views import *
from django.views.generic import RedirectView
from .settings import MEDIA_ROOT, MEDIA_URL, DEBUG
from django.conf.urls.static import static
from my_messages.views import *
from groups.views import *
from django.conf import settings


def acme_challenge(request, filename):
    path = os.path.join('.well-known/pki-validation', filename)
    with open(path, 'r') as file:
        response = HttpResponse(file.read(), content_type='text/plain')
    return response

urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', main, name='main'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('signup/', signup, name='signup'),
    path('accounts/profile/', RedirectView.as_view(url='/main/')),
    path('all_users/', all_users, name='all_users'),
    path('chat_with_user/<int:user_id>/', chat_with_user, name='chat_with_user'),
    path('chat/<int:chat_id>/', chat_detail, name='chat_detail'),
    path('my_messages', my_messages, name='my_messages'),
    path('groups/', groups, name='groups'),
    path('group/<str:group_name>/', group_chat, name='group_chat'),
    path('add_user_to_group/<int:group_id>/<int:user_id>/', add_user_to_group, name='add_user_to_group'),
    path('', RedirectView.as_view(url='/main/', permanent=True)), 
    # видалення через ajax
    path('delete_group_ajax/', delete_group_ajax, name='delete_group_ajax'),
    path('exit_group_ajax/', exit_group_ajax, name='exit_group_ajax'),
    # пошук через ajax
    path('search/', search_ajax, name='search_ajax'),
    path('search_group/', search_group_ajax, name='search_group_ajax'),

    re_path(r'^\.well-known/pki-validation/(?P<filename>[\w\-\_\.]+)$', acme_challenge)
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if DEBUG:
    urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)