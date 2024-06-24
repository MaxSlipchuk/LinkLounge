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