from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message, Chat
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.user_group_name = f'user_{self.scope["user"].id}'
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        username = text_data_json.get('username')

        if not message or not username:
            await self.send(text_data=json.dumps({'error': 'Message or username is missing'}))
            return

        try:
            user = await sync_to_async(User.objects.get)(username=username)
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({'error': 'User does not exist'}))
            return

        chat = await sync_to_async(Chat.objects.get)(id=self.chat_id)
        second_user = await sync_to_async(lambda: chat.user1 if chat.user1 != user else chat.user2)()

        await sync_to_async(Message.objects.create)(
            chat=chat,
            sender=user,
            message=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username
            }
        )

        if second_user:
            await self.channel_layer.group_send(
                f'user_{second_user.id}',
                {
                    'type': 'notify_message',
                    'message': f'Вам прийшло нове повідомлення від {user.username}',
                    'username': user.username,
                    'from_user': user.id,
                    'to_user': second_user.id
                }
            )
        else:
            print(f'Second user with ID {chat.user1 if chat.user1 != user else chat.user2} does not exist or is not online.')

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))

    async def notify_message(self, event):
        await self.send(text_data=json.dumps({
            'notification': event['message'],
            'from_user': event['from_user']
        }))