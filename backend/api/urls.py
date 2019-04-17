from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet, base_name='country')
router.register('city', views.CityViewSet, base_name='city')
router.register('image', views.ImageViewSet, base_name='image')
router.register('capital', views.CapitalViewSet, base_name='capital')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('token-auth/', views.signin, name='token-auth'),
    path('token-info/', views.user_info, name='token-info'),
    path('geojson/country/', views.CountryGeoView.as_view(),
         name='geo-country'),
    path('geojson/city/', views.CityGeoView.as_view(), name='geo-city'),
    path('countries/', views.CountriesHelperView.as_view(),
         name='countries-list'),
    path('countries/<int:pk>/', views.CountriesHelperDetailView.as_view(),
         name='countries-detail'),
]
