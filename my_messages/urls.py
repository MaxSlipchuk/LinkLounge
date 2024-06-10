from django.urls import path
from .views import my_messages

urlpatterns = [
    path('my_messages/', my_messages, name='my_messages'),
    # Інші маршрути
]