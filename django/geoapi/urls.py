from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('city', views.CityViewSet)
router.register('capital', views.CapitalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
