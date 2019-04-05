from django.urls import include, path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('api/', include('api.urls')),
    path('api/geo/', include('geoapi.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
