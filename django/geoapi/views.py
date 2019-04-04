from rest_framework import viewsets

from .models import City, Capital, Country
from .serializers import CitySerializer, CapitalSerializer, CountrySerializer


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('id')
    serializer_class = CitySerializer
    pagination_class = None


class CapitalViewSet(viewsets.ModelViewSet):
    queryset = Capital.objects.all().order_by('id')
    serializer_class = CapitalSerializer
    pagination_class = None


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountrySerializer
    pagination_class = None
