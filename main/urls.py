
from django.urls import path
from . import views
from django.contrib.auth import views as authViews

urlpatterns = [
    path('', views.about),
    path('about-us', views.about, name = 'about us'),
    path('task_list', views.task_list, name='tasks'),
    path('task', views.task, name='task'),
    path('task_list/<int:id>', views.delete, name="delete"),
    path('costcontrol', views.costcontrol, name="costcontrol"),
    path('register', views.register, name='register'),
    path('logout', authViews.LogoutView.as_view(next_page='tasks'), name='logout'),
    path('login', views.login1, name="login"),
    path('profile', views.profile, name="profile")

]
