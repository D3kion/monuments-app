from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('image', views.ImageViewSet)
router.register('city', views.CityViewSet)
router.register('capital', views.CapitalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('token-auth/', views.signin, name='token-auth'),
    path('token-info/', views.user_info, name='token-info'),
    path('geojson/country/', views.CountryGeoView.as_view(),
         name='country-geo'),
    path('geojson/city/', views.CityGeoView.as_view(), name='city-geo'),
    path('countries/', views.CountriesHelperView.as_view(),
         name='countires-list'),
    path('countries/<int:pk>/', views.CountriesHelperDetailView.as_view(),
         name='countires-detail'),
]
