# LinkLounge test
Social network

# Опис
Цей проєкт реалізує функціонал для роботи з груповими чатами, особистими повідомленнями користувачів та профілем користувача.

# Figma 
https://www.figma.com/design/L8WzDSrsrcwEBMmRg1b7lc/LinkLounge?node-id=6-3&t=BQT9GOW0w3f3Ti8M-1

# Команда проекта
- Max Slipchuk (Teamlead)
https://github.com/MaxSlipchuk 
- Maksym Hryhorenko (Full stack developer)
https://github.com/Max02039 
- Drahnieva Mariia (Full stack developer)
https://github.com/DragnevaMaria
- Tymchenko Rodion (Full stack developer)
https://github.com/Rodion096

# Контакти
Якщо у вас є питання щодо проекту, будь ласка, зв'яжіться зі мною за адресою електронної пошти nice.slipchukmax@gmail.com або через мою сторінку в GitHub: https://github.com/MaxSlipchuk



## Зміст
- [Технології](#технологии)
- [Початок роботи](#початок-роботи)
- [Моделі](#моделі)
- [Налаштування WebSocket](#налаштування-WebSocket)

## Технолології
- **HTML/CSS**: для створення інтерфейсів користувача.
- **Python/DJANGO**: серверна частина
- **JavaScript**: використовується для інтерактивності сторінок та реалізації WebSocket для чатів.
- **WebSocket**: ротокол передачі даних в реальному часі.
- **SQLite3/MySQL**: бази даних

## Початок роботи
1. Спочатку склонуйте репозиторій:
   ```
   git clone https://github.com/MaxSlipchuk/LinkLounge
   ```
2. Перейдіть у директорію проекту:
   ```
   cd LinkLounge
   ```
3. Встановіть залежності:
   django: фреймворк для роботи з веб-додатком (https://www.djangoproject.com/).
    ```
    pip install django
    ```
   channels: бібліотека для Django, яка надає підтримку асинхронних запитів, веб-сокетів у реального часі (https://github.com/django/channels).
   ```
   pip install channels
   ```
   daphne: основна функція - це обробка HTTP і WebSocket-запитів в асинхронному режимі для Django додатків, які використовують Channels(https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/daphne/).
   ```
   pip install daphne
   ```
4. Cтворіть адмін-користувача:
   ```
   python manage.py createsuperuser
   ```
   
5. Проведіть міграції з бд:
   ```
   python manage.py migrate
   ```
6. Запустіть сервер
   ```
   python manage.py runserver
   ```
## Налаштування WebSocket
Для налаштування WebSocket в проекті, необхідно виконати кілька кроків:
1. Додайте 'channels' і 'daphne' до встановлених додатків в settings.py, а потім вкажіть ASGI_APPLICATION
```
INSTALLED_APPS = [
    'daphne',
    'channels',
    'chat',
    'groups',
]

ASGI_APPLICATION = 'LinkLounge.asgi.application'
```
2. Налаштуйте канал передачі в settings.py:
```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```
3. Створюємо та налаштовуємо asgi.py в settings.py
```
import os
from django.core.asgi import get_asgi_application # створює ASGI-додаток для обробки HTTP-запитів у Django.
from channels.auth import AuthMiddlewareStack # забезпечує обробку аутентифікації для WebSocket-з'єднань.
from channels.routing import ProtocolTypeRouter, URLRouter #  використовуються для маршрутизації запитів різних типів (HTTP, WebSocket) до відповідних обробників.
import chat.routing  # Імпорт маршрутів URL для WebSocket для додатку чату
import groups.routing  # Імпорт маршрутів URL для WebSocket для додатку груп

# Встановлюємо змінну оточення для налаштування Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkLounge.settings')

# Створюємо ProtocolTypeRouter для маршрутизації різних протоколів (http, websocket) до відповідних додатків
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # HTTP-протокол обробляється за допомогою ASGI-додатку Django
    "websocket": AuthMiddlewareStack(  # Middleware-стек для обробки аутентифікації WebSocket
        URLRouter(
            chat.routing.websocket_urlpatterns + groups.routing.websocket_urlpatterns
        )  # Маршрутизація URL WebSocket до відповідних споживачів
    ),
})
```
4. Налаштуйте маршрутизацію для WebSocket у chat/routing.py:
```
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi()),
]
```
7. Створіть ChatConsumer у chat/consumers.py:
```
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
```
## Моделі