from rest_framework import viewsets, generics, filters

from .models import City, Capital, Country, CountriesHelper
from .serializers import (
    CountrySerializer, CitySerializer, CapitalSerializer,
    CountryGeoSerializer, CityGeoSerializer,
    CountryInfoSerializer, CityInfoSerializer,
    CountryInfoHelperSerializer, CityInfoHelperSerializer,
    CountriesHelperSerializer, CountriesHelperListSerializer,
)


#
# Country
#
class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    pagination_class = None


class CountryGeoView(generics.ListAPIView):
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountryGeoSerializer
    pagination_class = None


class CountryInfoView(generics.RetrieveAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryInfoSerializer


class CountrySearchView(generics.ListAPIView):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountryInfoHelperSerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


#
# City
#
class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('country.name').order_by('name')
    serializer_class = CitySerializer
    pagination_class = None


class CityGeoView(generics.ListAPIView):
    queryset = City.objects.all().order_by('id')
    serializer_class = CityGeoSerializer
    pagination_class = None


class CityInfoView(generics.RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityInfoSerializer


class CitySearchView(generics.ListAPIView):
    queryset = City.objects.all().order_by('country.name').order_by('name')
    serializer_class = CityInfoHelperSerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


#
# Capital
#
class CapitalViewSet(viewsets.ModelViewSet):
    queryset = Capital.objects.all().order_by('name')
    serializer_class = CapitalSerializer
    pagination_class = None


#
# CountriesHelper
#
class CountriesHelperView(generics.RetrieveAPIView):
    queryset = CountriesHelper.objects.all().order_by('name')
    serializer_class = CountriesHelperSerializer
    pagination_class = None


class CountriesHelperListView(generics.ListAPIView):
    qs1 = Country.objects.values_list('name')
    qs2 = CountriesHelper.objects.values_list('name')
    qs = qs2.difference(qs1)
    queryset = CountriesHelper.objects.filter(name__in=qs).order_by('name')
    serializer_class = CountriesHelperListSerializer
    pagination_class = None
