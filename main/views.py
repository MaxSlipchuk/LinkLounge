from django.shortcuts import render
from account.models import *

# Create your views here.

def main(request):
    return render(request, 'main/main.html', context={'user': 'user'})