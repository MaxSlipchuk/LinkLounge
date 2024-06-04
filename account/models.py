from django.db import models

# Create your models here.

class User(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=100)
    remember_me = models.BooleanField(default=False, blank=True, null=True)

