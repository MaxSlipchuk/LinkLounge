from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib.auth.models import User
from .models import Group, Message
from .forms import GroupForm

@login_required
def groups(request):
    owned_groups = Group.objects.filter(admin=request.user)
    member_groups = Group.objects.filter(members=request.user).exclude(admin=request.user)
    if request.method == 'POST':
        form = GroupForm(request.POST)
        if form.is_valid():
            group = form.save(commit=False)
            group.admin = request.user
            group.save()
            group.members.add(request.user)
            return redirect('groups')
    else:
        form = GroupForm()

    context = {
        'owned_groups': owned_groups,
        'member_groups': member_groups,
        'form': form
    }
    return render(request, 'groups/groups.html', context)


@login_required
def group_chat(request, group_name):
    group = get_object_or_404(Group, name=group_name)
    if request.user not in group.members.all():
        return HttpResponseForbidden("Ви не є учасником цієї групи")

    messages = Message.objects.filter(group=group).order_by('timestamp')
    # Отримати всіх користувачів, крім поточного та адміністратора
    users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)

    context = {
        'group': group,
        'messages': messages,
        'users': users
    }
    return render(request, 'groups/group_chat.html', context)

@login_required
def add_group_member(request, group_name, user_id):
    group = get_object_or_404(Group, name=group_name)
    user_to_add = get_object_or_404(User, id=user_id)
    
    if request.user != group.admin:
        return HttpResponseForbidden("Тільки адміністратор може додавати учасників до групи.")
    
    group.add_member(user_to_add)
    return redirect('group_chat', group_name=group_name)

def add_user_to_group(request, group_id, user_id):
    group = get_object_or_404(Group, id=group_id)
    user = get_object_or_404(User, id=user_id)
    
    if request.user != group.admin:
        return HttpResponseForbidden("Ви не маєте прав додавати користувачів до цієї групи")

    group.members.add(user)
    return JsonResponse({'status': 'ok'})
# Create your views here.

# @login_required
# def groups(request):
    # Отримати всіх користувачів, крім поточного та адміністратора
    # users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    
    # context = {'users': users}
    # return render(request, 'groups/groups.html', context)
