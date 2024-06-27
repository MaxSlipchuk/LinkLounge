from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    user1 = models.ForeignKey(User, related_name='user1_chats', on_delete=models.SET_NULL, blank=True, null=True)
    user2 = models.ForeignKey(User, related_name='user2_chats', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"Чат між {self.user1} і {self.user2}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    # Дата та час, коли було створено це повідомлення. auto_now_add=True автоматично встановлює цей час при створенні запису.
    message = models.TextField(blank=True, null=True)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE, blank=True, null=True)
    # використовується для зв'язку з об'єктами користувачів, які відправили повідомлення.

    def __str__(self):
        return f'{self.sender}: {self.message} ({self.timestamp})'