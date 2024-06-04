"""
URL configuration for LinkLounge project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main.views import *
from account.views import *
from app_base.views import *
from account.forms import CustomAuthenticationForm
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', main, name='main'),
    path('login/', auth_views.LoginView.as_view(template_name='account/login.html', authentication_form=CustomAuthenticationForm), name='login'),
    path('logout/', user_logout, name='logout'),  # Замінено auth_views.LogoutView на user_logout
    path('signup/', signup, name='signup'),
    path('accounts/profile/', RedirectView.as_view(url='/main/')),  # Додайте це перенаправлення
]
