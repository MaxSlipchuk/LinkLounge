from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
import re
from django.contrib.auth import authenticate


class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(label="Ім'я")
    last_name = forms.CharField(label="Прізвище")
    username = forms.CharField(label="Ім'я користувача")
    password1 = forms.CharField(label="Пароль", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Підтвердження паролю", widget=forms.PasswordInput)
    age = forms.IntegerField(label="Вік", widget=forms.NumberInput(attrs={'placeholder': 'Вік'}))

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password1', 'password2', 'age']

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({
                'class': 'form-control',
                'placeholder': self.fields[field_name].label
            })

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not re.match(r'^[A-Za-zА-Яа-яЇїІіЄєҐґ]+$', username):
            raise forms.ValidationError("Ім'я користувача може містити лише літери.")
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Користувач з таким логіном вже існує.")
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 8:
            raise forms.ValidationError("Пароль повинен містити щонайменше 8 символів.")
        return password1

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Паролі не співпадають.")
        return cleaned_data

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        error_messages={
            'required': 'Будь ласка, введіть логін'
        }
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        error_messages={
            'required': 'Будь ласка, введіть ваш пароль'
        }
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not User.objects.filter(username=username).exists():
            raise forms.ValidationError("Такого користувача немає")
        return username
    
    def clean_password(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            user = authenticate(self.request, username=username, password=password)
            if user is None:
                raise forms.ValidationError("Неправильний пароль")
        return password
        