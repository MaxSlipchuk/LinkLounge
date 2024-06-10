from django.urls import path
from . import views

urlpatterns = [
    # Інші маршрути
    path('chat_with_user/<int:user_id>/', views.chat_with_user, name='chat_with_user'),
    path('chat/<int:chat_id>/', views.chat_detail, name='chat_detail'),
]