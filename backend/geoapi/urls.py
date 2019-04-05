from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('city', views.CityViewSet)
router.register('capital', views.CapitalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('geojson/country/', views.CountryGeoView.as_view(),
         name='country-geo'),
    path('geojson/city/', views.CityGeoView.as_view(), name='city-geo'),
    path('info/country/<int:pk>/', views.CountryInfoView.as_view(),
         name='country-info'),
    path('info/city/<int:pk>/', views.CityInfoView.as_view(),
         name='city-info'),
    path('search/country/', views.CountrySearchView.as_view(),
         name='country-search'),
    path('search/city/', views.CitySearchView.as_view(),
         name='city-search'),
    path('countries/', views.CountriesHelperListView.as_view(),
         name='countires-list'),
    path('countries/<int:pk>/', views.CountriesHelperView.as_view(),
         name='countires-detail'),
]
