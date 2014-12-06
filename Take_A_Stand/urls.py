from django.conf.urls import url
from Take_A_Stand import views

urlpatterns = [
    url(r'^$', views.index, name='index')
]