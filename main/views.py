from django.shortcuts import render
from account.models import *
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from django.contrib.auth.models import User
from .forms import SettingsUserProfile
from .forms import SettingsUser


# Create your views here.
# @login_required
# def main(request):
#     return render(request, 'main/main.html', context={'user': 'user'})
@login_required
def main(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if request.method == 'POST':
        form_user_profile = SettingsUserProfile(request.POST)
        form_user = SettingsUser(request.POST, current_user = request.user)
        # if form_user.is_valid() and form_user_profile.is_valid():
        if form_user.is_valid():
            user = request.user
            user.username = form_user.cleaned_data['username']
            user.first_name = form_user.cleaned_data['first_name']
            user.last_name = form_user.cleaned_data['last_name']
            # if form_user.cleaned_data['password']:
            #     user.set_password(form_user.cleaned_data['password'])
            data = {
                'username': form_user.cleaned_data['username'],
                'first_name': form_user.cleaned_data['first_name'],
                'last_name': form_user.cleaned_data['last_name']

            }
            user.save()
            return JsonResponse({'status': 'valid', 'data': data})
        else:
            errors = form_user.errors.as_json()
            print('не валідна')
            return JsonResponse({'status': 'invalid', 'errors': errors})
    else:
        # form_user_profile = SettingsUserProfile()
        form_user = SettingsUser(current_user=request.user)
    if is_ajax:
        print("ajax")
        html = render_to_string('main/partial_content.html', {'form_user': form_user}, request=request)
        return JsonResponse({'html': html})  # Повертаємо JSON-дані з HTML-контентом
    else:
        return render(request, 'main/main.html', context={'form_user': form_user})