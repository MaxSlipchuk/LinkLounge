from django.shortcuts import render
from account.models import *
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def main(request):
    return render(request, 'main/main.html', context={'user': 'user'})