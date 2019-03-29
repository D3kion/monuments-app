from rest_framework import viewsets
from rest_framework_gis.pagination import GeoJsonPagination

from .models import City, Country
from .serializers import CitySerializer, CountrySerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    pagination_class = None


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('name')
    serializer_class = CitySerializer
    pagination_class = None
