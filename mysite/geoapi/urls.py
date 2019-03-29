from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('city', views.CityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', tokenviews.obtain_auth_token),
]
