from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import  AuthenticationForm
from .forms import RegistrationForm, CustomAuthenticationForm
from .models import *

def signup(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            age = form.cleaned_data.get('age') 
            UserProfile.objects.create(user=user, age=age)  
            login(request, user)
            return redirect('main')
    else:
        form = RegistrationForm()
    return render(request, 'account/signup.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('main')
        return render(request, 'account/login.html', {'form': form})
    else:
        form = CustomAuthenticationForm()
    return render(request, 'account/login.html', {'form': form})



