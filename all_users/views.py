from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.template.loader import render_to_string


@require_POST
def search_ajax(request):
    search = request.POST.get('search', '')
    users = User.objects.filter(username__icontains=search).exclude(id=request.user.id).exclude(is_superuser=True)
    users_data = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_image': user.userprofile.image.url if user.userprofile.image else '/static/main/img/default_profile.png'
        }
        users_data.append(user_data)
    return JsonResponse({'status': 'success', 'users': users_data})

@login_required
def all_users(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    if is_ajax:
        html = render_to_string('all_users/partial_content.html', {'users': users}, request=request)
        return JsonResponse({'html': html}) 
    else:
        return render(request, 'all_users/all_users.html', {'users': users})
