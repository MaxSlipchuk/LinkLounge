from django.shortcuts import render
from account.models import *

# Create your views here.

def main(request):
    # user_id = request.session['user_id']
        # Виконуйте дії з користувачем на основі його ідентифікатора
        # Наприклад, отримайте об'єкт користувача з цим ідентифікатором
    # user = User.objects.get(pk=user_id)
    
    return render(request, 'main/main.html', context={'user': 'user'})