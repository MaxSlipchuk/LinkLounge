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