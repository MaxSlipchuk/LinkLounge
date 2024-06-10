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
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']

        try:
            user = await sync_to_async(User.objects.get)(username=username)
        except User.DoesNotExist:
            # Handle the error if the user does not exist
            await self.send(text_data=json.dumps({
                'error': 'User does not exist'
            }))
            return

        chat = await sync_to_async(Chat.objects.get)(id=self.chat_id)

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

    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))