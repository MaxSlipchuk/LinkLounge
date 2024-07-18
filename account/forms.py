from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
import re
from django.contrib.auth import authenticate

class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(label="Ім'я", max_length=13)
    last_name = forms.CharField(label="Прізвище", max_length=13)
    username = forms.CharField(label="Логін", max_length=15)
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

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        invalid_chars = re.findall(r'[^A-Za-zА-Яа-яЇїІіЄєҐґ]', first_name)
        if invalid_chars:
            self.fields['first_name'].widget.attrs.update({
            'class': 'error-field'
        })
            raise forms.ValidationError("Тут можуть бути лише літери")
        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        invalid_chars = re.findall(r'[^A-Za-zА-Яа-яЇїІіЄєҐґ]', last_name)
        if invalid_chars:
            self.fields['last_name'].widget.attrs.update({
            'class': 'error-field'
        })
            raise forms.ValidationError("Тут можуть бути лише літери")
        return last_name

    def clean_username(self):
        username = self.cleaned_data.get('username')
        invalid_chars = re.findall(r'[^A-Za-zА-Яа-яЇїІіЄєҐґ0-9]', username)
        if invalid_chars:
            self.fields['username'].widget.attrs.update({
            'class': 'error-field'
        })
            raise forms.ValidationError(f"Тут є неприпустимий символ: {invalid_chars[0]}")
        if User.objects.filter(username=username).exists():
            self.fields['username'].widget.attrs.update({
            'class': 'error-field'
        })
            raise forms.ValidationError("Користувач з таким логіном вже існує")
            
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 8:
            self.fields['password1'].widget.attrs.update({
            'class': 'error-field'
        })
            raise forms.ValidationError("Пароль повинен містити щонайменше 8 символів")
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Паролі не співпадають")
        return password2

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
                self.fields['password'].widget.attrs.update({
            'class': 'error-field'
        })
                raise forms.ValidationError("Неправильний пароль")
        return password
        