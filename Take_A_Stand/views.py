from django.shortcuts import render


def index(request):
    return render(request, 'Take_A_Stand/index.html')
