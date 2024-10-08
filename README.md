# LinkLounge 
Social network

#Посилання на сайт
https://linklounge-0488d39446ec.herokuapp.com/

# Опис
Цей проєкт реалізує функціонал для роботи з груповими чатами, особистими повідомленнями користувачів та профілем користувача.

![Опис GIF](gif_1.gif)

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
- **AJAX**: використовується для відображення інформації без перезавантаження сторінки.
- **WebSocket**: протокол передачі даних в реальному часі.
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
## Моделі
- Модель користувача
```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
```
Створюємо власну модель користувача на основі вбудоаної моделі User, для можливості додавання полів

- Модель чата і повідомлення
```python
from django.db import models
=======
- Модель користува
```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
```
Створюємо власну модель, для того щоб можна було вносити додаткові зміни до користувача, і використовуємо зв'зок OneToOneField з вбудованою моделю User
- Модель чата між двома користувачами і повідомлення
```python
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
```
- Модель групи і повідомлення в ній
```python
from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=25)
    admin = models.ForeignKey(User, related_name='owned_groups', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='group_memberships')

    def add_member(self, user):
        self.members.add(user)

    def __str__(self):
        return self.name

class Message(models.Model):
    group = models.ForeignKey(Group, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.message}'
```
## Налаштування WebSocket
Для налаштування WebSocket в проекті, необхідно виконати кілька кроків:
1. Додайте 'channels' і 'daphne' до встановлених додатків в settings.py, а потім вкажіть ASGI_APPLICATION
```python
INSTALLED_APPS = [
    'daphne',
    'channels',
    'chat',
    'groups',
]

ASGI_APPLICATION = 'LinkLounge.asgi.application'
```
2. Налаштуйте канал передачі в settings.py:
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```
3. Створюємо та налаштовуємо asgi.py в settings.py
```python
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
```python
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi()),
]
```
5. Створіть ChatConsumer у chat/consumers.py:
```python
from channels.generic.websocket import AsyncWebsocketConsumer
# базовий клас AsyncWebsocketConsumer для створення асинхронного WebSocket-споживача.
import json
from .models import Message, Chat
from django.contrib.auth.models import User

class Chat(models.Model):
    user1 = models.ForeignKey(User, related_name='user1_chats', on_delete=models.CASCADE, blank=True, null=True)
    user2 = models.ForeignKey(User, related_name='user2_chats', on_delete=models.CASCADE, blank=True, null=True)

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
```
6. Налаштуйте frontend для роботи з WebSocket
```javascript
document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    // Отримує chatId з URL-адреси.
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
    );
    // Створює новий WebSocket-з'єднання з сервером за адресою /ws/chat/<chatId>/.

    const messagesContainer = document.querySelector('.messages');
    // Знаходить контейнер для повідомлень у DOM, де будуть відображатися отримані повідомлення.

    chatSocket.onmessage = function(e) {
    // Ця функція викликається щоразу, коли WebSocket отримує нове повідомлення.
        const data = JSON.parse(e.data);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (data.username === user) {
            messageElement.classList.add('me');
        } else {
            messageElement.classList.add('other');
        }
        messageElement.innerHTML = `
            <div class="message-content">
                <strong class="message-username"><span>@</span>${data.username}</strong>
                <span class="message-text">${data.message}</span>
            </div>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    chatSocket.onclose = function(e) {
    // Ця функція викликається, коли WebSocket-з'єднання несподівано закривається.
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
    // Ця функція викликається при відправленні форми повідомлень.
        e.preventDefault();
        const messageInputDom = document.querySelector('#message-input');
        const message = messageInputDom.value;
        // Отримує значення введеного повідомлення.
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user 
        }));
        // Відправляє повідомлення на WebSocket-сервер у форматі JSON.
        messageInputDom.value = '';
        // Очищає поле введення повідомлень.
    };

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
```
## Користуйтесь)
![Опис GIF](gif_2.gif)
