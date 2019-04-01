from django.urls import include, path
from rest_framework import routers

from . import views
from api.views import signin

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('city', views.CityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token-auth/', signin),
]
