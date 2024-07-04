import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Group, Message

# Клас споживача для групового чату з асинхронною підтримкою WebSocket
class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Отримуємо ім'я групи з URL
        self.group_name = self.scope['url_route']['kwargs']['group_name']
        # Створюємо ім'я кімнати на основі імені групи
        self.room_group_name = f'group_{self.group_name}'

        # Додаємо поточний канал до групи
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Приймаємо з'єднання WebSocket
        await self.accept()

    async def disconnect(self, close_code):
        # Видаляємо поточний канал з групи при відключенні
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Отримуємо дані з WebSocket-з'єднання
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']

        # Зберігаємо повідомлення в базі даних
        await self.save_message(username, message)

        # Надсилаємо повідомлення всім користувачам у групі
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'group_message',
                'message': message,
                'username': username
            }
        )

    async def group_message(self, event):
        # Отримуємо повідомлення та ім'я користувача з події
        message = event['message']
        username = event['username']

        # Надсилаємо повідомлення назад клієнту через WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))

    @database_sync_to_async
    def save_message(self, username, message):
        # Отримуємо користувача за ім'ям користувача
        user = User.objects.get(username=username)
        # Отримуємо групу за ім'ям групи
        group = Group.objects.get(name=self.group_name)
        # Створюємо нове повідомлення і зберігаємо його в базі даних
        Message.objects.create(group=group, sender=user, message=message)