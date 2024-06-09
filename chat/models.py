from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    participants = models.ManyToManyField(User)

class Message(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.username}: {self.message} ({self.timestamp})'