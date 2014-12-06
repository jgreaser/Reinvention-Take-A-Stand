from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
                       url(r'^$', include('Take_A_Stand.urls')),
                       url(r'^admin/', include(admin.site.urls)),)
