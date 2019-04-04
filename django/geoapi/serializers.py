from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Country


class CitySerializer(GeoFeatureModelSerializer):
    country = serializers.StringRelatedField()

    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['url', 'name', 'description', 'country']


class CountrySerializer(GeoFeatureModelSerializer):
    city_set = serializers.StringRelatedField(many=True)

    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['url', 'name', 'city_set']
