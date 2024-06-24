from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi()),
]
# websocket_urlpatterns: Це список, який містить маршрути URL для WebSocket-з'єднань. 
# Цей список буде використовуватися URLRouter для маршрутизації WebSocket-запитів.
# path('ws/chat/int_id>/', consumers.ChatConsumer.as_asgi()): Визначає маршрут URL для WebSocket-з'єднання.
# 'ws/chat/int_id>/': Вказує URL-шаблон для WebSocket-з'єднання. У цьому випадку, WebSocket-з'єднання буде встановлюватися за URL, 
# що починається з 'ws/chat/', і містить параметр chat_id. Цей параметр буде передаватися у WebSocket-споживача для обробки.
# consumers.ChatConsumer.as_asgi(): Вказує, що запити за цим URL будуть оброблятися споживачем ChatConsumer, 
# який визначений у модулі consumers. 
# Виклик as_asgi() перетворює клас споживача у ASGI-додаток, який може обробляти WebSocket-запити.