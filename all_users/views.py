from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

@login_required
def all_users(request):
    # Отримати всіх користувачів, крім поточного та адміністратора
    if 'search' in request.GET:
        search = request.GET['search']
        users = User.objects.filter(username__icontains=search).exclude(id=request.user.id).exclude(is_superuser=True)
    else:
        users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    context = {'users': users}
    return render(request, 'all_users/all_users.html', context)
