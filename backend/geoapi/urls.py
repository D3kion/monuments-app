from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('country', views.CountryViewSet)
router.register('city', views.CityViewSet)
router.register('capital', views.CapitalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Country
    path('geojson/country/', views.CountryGeoView.as_view(),
         name='country-geo'),
    path('info/country/', views.CountryInfoView.as_view(),
         name='country-info'),
    path('info/country/<int:pk>/', views.CountryInfoDetailView.as_view(),
         name='country-detail-info'),
    path('search/country/', views.CountrySearchView.as_view(),
         name='country-search'),
    # City
    path('geojson/city/', views.CityGeoView.as_view(), name='city-geo'),
    path('info/city/<int:pk>/', views.CityInfoDetailView.as_view(),
         name='city-detail-info'),
    path('search/city/', views.CitySearchView.as_view(),
         name='city-search'),
    path('edit/city/<int:pk>/', views.CityPUTView.as_view(),
         name='city-edit'),
    # CountriesHelper
    path('countries/', views.CountriesHelperListView.as_view(),
         name='countires-list'),
    path('countries/<int:pk>/', views.CountriesHelperView.as_view(),
         name='countires-detail'),
]
