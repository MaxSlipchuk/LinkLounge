from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
import re

class RegistrationForm(UserCreationForm):
    remember_me = forms.BooleanField(label="Запам'ятати мене", required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({'class': 'form-control'})
        self.fields['remember_me'].widget.attrs.update({'class': 'form-check-input'})

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

    # def clean_email(self):
    #     email = self.cleaned_data.get('email')
    #     if User.objects.filter(email=email).exists():
    #         raise forms.ValidationError("Користувач з таким email вже існує.")
    #     return email

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Паролі не співпадають.")
        return cleaned_data
    
class CustomAuthenticationForm(AuthenticationForm):
    remember_me = forms.BooleanField(required=False, widget=forms.CheckboxInput())

    class Meta:
        model = User
        fields = ('username', 'password', 'remember_me')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control'}),
        }