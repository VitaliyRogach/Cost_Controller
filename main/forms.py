from .models import Task
from django.forms import ModelForm, TextInput, Textarea
from django import forms


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = ["title", "task"]
        widgets = {"title": TextInput(attrs={
                'class': 'form-control',
                'placeholder' : 'Введите название'
            }),
            "task": Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Введите текст'
        }),
        }

