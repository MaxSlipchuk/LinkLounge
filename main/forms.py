from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from account.models import UserProfile
import re
from django.http import JsonResponse



# class SettingsProfile(forms.ModelForm):
#     def __init__(self, *args, **kwargs):
#         super(SettingsProfile, self).__init__(*args, **kwargs)
#         self.fields['username'].help_text = ""
#         self.fields['first_name'].help_text = ""
#         self.fields['last_name'].help_text = ""

#     class Meta:
#         model = User
#         fields = ['username', 'first_name', 'last_name', 'password']
#         widgets = {
#         'username':forms.TextInput(attrs={'class':'fb_form','placeholder':'логін'}),
#         'first_name':forms.TextInput(attrs={'class':'fb_form','placeholder': 'імя'}),
#         'last_name':forms.TextInput(attrs={'class':'fb_form','placeholder':'прізвище'}),
#         'password': forms.PasswordInput(attrs={'class':'fb_form','placeholder':'пароль',})
#         }

#     def clean_first_name(self):
#         first_name = self.cleaned_data.get('first_name')
#         invalid_chars = re.findall(r'[^A-Za-zА-Яа-яЇїІіЄєҐґ]', first_name)
#         if invalid_chars:
#             self.fields['first_name'].widget.attrs.update({
#             'class': 'error-field'})
#             print('має бути помилка')
#             raise forms.ValidationError("Тут можуть бути лише літери")
#         return first_name
    
#     def clean_last_name(self):
#         last_name = self.cleaned_data.get('last_name')
#         invalid_chars = re.findall(r'[^A-Za-zА-Яа-яЇїІіЄєҐґ]', last_name)
#         if invalid_chars:
#             self.fields['last_name'].widget.attrs.update({
#             'class': 'error-field'})
#             print('має бути помилка')
#             raise forms.ValidationError("Тут можуть бути лише літери")
#         return last_name



# class SettingsProfile(forms.ModelForm):
#     class Meta:
#         model = UserProfile
#         # fields = ['username', 'first_name', 'last_name', 'password']
#         fields = '__all__'


class SettingsUserProfile(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['age', 'image']
        # fields = '__all__'
    
class SettingsUser(forms.ModelForm):
    username = forms.CharField(label="Логін", max_length=15, required=False)
    first_name = forms.CharField(label="Ім'я", max_length=15, required=False)
    last_name = forms.CharField(label="Прізвише", max_length=15, required=False)
    password = forms.CharField(label="Ваш пароль", min_length=8, widget=forms.PasswordInput, required=False)
    new_password = forms.CharField(label="Новий пароль", min_length=8, widget=forms.PasswordInput, required=False)
    confirm_password = forms.CharField(label="Підтвердити пароль", min_length=8, widget=forms.PasswordInput, required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'password',]
        # fields = '__all__'

    
    def __init__(self, *args, **kwargs):
        self.current_user = kwargs.pop('current_user', None)
        # username = self.current_user.username
        super(SettingsUser, self).__init__(*args, **kwargs)
        

        if self.current_user:
            self.fields['username'].initial = self.current_user.username
            self.fields['first_name'].initial = self.current_user.first_name
            self.fields['last_name'].initial = self.current_user.last_name

        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({
                'class': 'form-control',
                'placeholder': self.fields[field_name].label,
            })
        
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            self.add_error('username', 'Користувач з таким логіном вже існує')
        elif '1' in username:
            self.add_error('username', 'Є одиниця в логіні')
        return username
    
    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if '2' in first_name:
            self.add_error('first_name', 'Є двійка в імені')
        return first_name
    
    def clean_password(self):
        user = self.current_user
        input_password = self.cleaned_data.get('password')
        
        if input_password != '' and not user.check_password(input_password):
            self.add_error('password', 'Неправильний пароль')

        return input_password
