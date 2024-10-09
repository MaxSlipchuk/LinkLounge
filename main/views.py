from django.shortcuts import render
from account.models import *
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.template.loader import render_to_string

# Create your views here.
# @login_required
# def main(request):
#     return render(request, 'main/main.html', context={'user': 'user'})

def main(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if is_ajax:
        print("ajax")
        html = render_to_string('main/partial_content.html', {}, request=request)
        return JsonResponse({'html': html})  # Повертаємо JSON-дані з HTML-контентом
    else:
        return render(request, 'main/main.html', context={'user': 'user'})