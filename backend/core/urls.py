from django.conf import settings
from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    path('', views.index),
    re_path(r'^media/uploads/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT + '/uploads/'}),
    re_path(r'^(?P<path>.*\..*)$', serve, {
        'document_root': settings.STATIC_ROOT}),
]
