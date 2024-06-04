from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import  AuthenticationForm
from .forms import RegistrationForm

def signup(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            remember_me = form.cleaned_data.get('remember_me', False)
            if remember_me:
                request.session.set_expiry(1209600)  # 2 тижні
            else:
                request.session.set_expiry(0)  # Браузер закриється - сесія завершиться
            login(request, user)
            return redirect('main')
    else:
        form = RegistrationForm()
    return render(request, 'account/signup.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                remember_me = form.cleaned_data.get('remember_me')
                if remember_me:
                    request.session.set_expiry(1209600)  # 2 тижні
                return redirect('main')
        else:
            return render(request, 'account/login.html', {'form': form})
    else:
        form = AuthenticationForm()
    return render(request, 'account/login.html', {'form': form})



