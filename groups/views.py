from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def groups(request):
    return render(request, 'groups/groups.html')


# def groups(request):
#     # Отримати всіх користувачів, крім поточного та адміністратора
#     all_groups = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
#     user_groups = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    
#     context = {'groups': groups}
#     return render(request, 'all_users/all_users.html', context)
