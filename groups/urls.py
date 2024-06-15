# groups/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.groups, name='groups'),
    path('<int:group_id>/', views.group_chat, name='group_chat'),
]