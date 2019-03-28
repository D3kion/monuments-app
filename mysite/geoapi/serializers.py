from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Country


class CountrySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['name']


class CitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['name', 'description']
