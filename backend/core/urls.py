from django.conf import settings
from django.urls import re_path
from django.views.static import serve

urlpatterns = [
    re_path(r'^media/uploads/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT + '/uploads/'}),
    re_path(r'^(?:index.html)?$', serve, {
        'path': 'index.html',
        'document_root': settings.STATIC_ROOT}),
    re_path(r'^(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
