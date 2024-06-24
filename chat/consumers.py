from channels.generic.websocket import AsyncWebsocketConsumer
# базовий клас AsyncWebsocketConsumer для створення асинхронного WebSocket-споживача.
import json
from .models import Message, Chat
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
# для перетворення синхронних функцій у асинхронні.

class ChatConsumer(AsyncWebsocketConsumer):
#Клас, який обробляє WebSocket-з'єднання.
    async def connect(self):
    # Метод для обробки підключення WebSocket.
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        #Отримує chat_id з URL WebSocket-з'єднання.
        self.room_group_name = f'chat_{self.chat_id}'
        # Створює ім'я групи для чату.

        await self.channel_layer.group_add(
        # Додає поточне WebSocket-з'єднання до групи чату.
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        # Приймає WebSocket-з'єднання.

    async def disconnect(self, close_code):
    # Видаляє поточне WebSocket-з'єднання з групи чату.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
    # Метод для обробки отриманих повідомлень.
        text_data_json = json.loads(text_data)
        # Парсить отримані JSON-дані.
        message = text_data_json['message']
        # Отримує повідомлення з JSON.
        username = text_data_json['username']
        # Отримує ім'я користувача з JSON.

        try:
            user = await sync_to_async(User.objects.get)(username=username)
            # Отримує користувача з бази даних асинхронно.
        except User.DoesNotExist:
        # Перевіряє, чи існує користувач.
            await self.send(text_data=json.dumps({
                'error': 'User does not exist'
            }))
            return

        chat = await sync_to_async(Chat.objects.get)(id=self.chat_id)
        # Отримує чат з бази даних асинхронно.

        await sync_to_async(Message.objects.create)(
            chat=chat,
            sender=user,
            message=message
        )
        # Створює нове повідомлення в базі даних асинхронно.

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username
            }
        )
        # Відправляє повідомлення всім клієнтам у групі.

    async def chat_message(self, event):
    # Метод для відправлення повідомлень назад клієнту.
        message = event['message']
        # Отримує повідомлення з події.
        username = event['username']
        # Отримує ім'я користувача з події.

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))
        # Відправляє повідомлення та ім'я користувача назад клієнту.