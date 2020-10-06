from django.shortcuts import render, redirect
from .models import Task
from .forms import TaskForm
from django.http import HttpResponseRedirect, HttpResponseNotFound
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.urls import reverse



def about(request):
    return render(request, 'main/about.html')

def costcontrol(request):
    return render(request, 'main/costcontrol.html')

def task_list(request):
    tasks = Task.objects.all()
    return render(request, 'main/task_list.html', {'title': 'task_list', 'tasks': tasks})

def task(request):
    error = ''
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            redirect('task')
        else:
            error = 'Форма была неверной!'
    form = TaskForm()
    context = {
        'form': form,
        'error': error
    }
    return render(request, 'main/task.html', context)


def delete(request, id):
    try:
        task = Task.objects.get(id=id)
        task.delete()
        return HttpResponseRedirect("/task_list")
    except Task.DoesNotExist:
        return HttpResponseNotFound("<h2>Task not found</h2>")


def login1(request, *args, **kwargs):
    context = {}
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/")
        else:
            context['error'] = "Логин или пароль неправильные"
    return render(request, 'main/login.html', context)


def profile(request):
    return render(request, 'main/profile.html')


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        if password == password2:
            User.objects.create_user(username, email, password)
            return redirect(reverse('about us'))

    return render(request, 'main/register.html')