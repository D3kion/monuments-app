from rest_framework import viewsets, generics

from .models import City, Capital, Country
from .serializers import (
    CountryGeoSerializer, CityGeoSerializer,
    CountryInfoSerializer, CityInfoSerializer,
    CountrySerializer, CitySerializer, CapitalSerializer,
)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountrySerializer
    pagination_class = None


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('id')
    serializer_class = CitySerializer
    pagination_class = None


class CapitalViewSet(viewsets.ModelViewSet):
    queryset = Capital.objects.all().order_by('id')
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
