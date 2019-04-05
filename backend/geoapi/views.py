from rest_framework import viewsets, generics, filters

from .models import City, Capital, Country, CountriesHelper
from .serializers import (
    CountryGeoSerializer, CityGeoSerializer,
    CountryInfoSerializer, CityInfoSerializer,
    CountryInfoHelperSerializer, CityInfoHelperSerializer,
    CountrySerializer, CitySerializer, CapitalSerializer,
    CountriesHelperSerializer, CountriesHelperListSerializer,
)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    pagination_class = None


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('country.name').order_by('name')
    serializer_class = CitySerializer
    pagination_class = None


class CapitalViewSet(viewsets.ModelViewSet):
    queryset = Capital.objects.all().order_by('name')
    serializer_class = CapitalSerializer
    pagination_class = None


class CountryGeoView(generics.ListAPIView):
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountryGeoSerializer
    pagination_class = None


class CityGeoView(generics.ListAPIView):
    queryset = City.objects.all().order_by('id')
    serializer_class = CityGeoSerializer
    pagination_class = None


class CountryInfoView(generics.RetrieveAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryInfoSerializer


class CityInfoView(generics.RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityInfoSerializer


class CountrySearchView(generics.ListAPIView):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountryInfoHelperSerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CitySearchView(generics.ListAPIView):
    queryset = City.objects.all().order_by('country.name').order_by('name')
    serializer_class = CityInfoHelperSerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


#
# CountriesHelper
#
class CountriesHelperView(generics.RetrieveAPIView):
    queryset = CountriesHelper.objects.all().order_by('name')
    serializer_class = CountriesHelperSerializer
    pagination_class = None


class CountriesHelperListView(generics.ListAPIView):
    queryset = CountriesHelper.objects.all().order_by('name')
    serializer_class = CountriesHelperListSerializer
    pagination_class = None
