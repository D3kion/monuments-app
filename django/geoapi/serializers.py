from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Capital, Country


class CitySerializer(GeoFeatureModelSerializer):
    country = serializers.StringRelatedField()

    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['url', 'name', 'description', 'country']

class CapitalSerializer(serializers.ModelSerializer):
    city_name = serializers.StringRelatedField(source='city')
    capital_name = serializers.StringRelatedField(source='capital_of')

    class Meta:
        model = Capital
        fields = ['url', 'city', 'capital_of',
                  'city_name', 'capital_name']


class CountrySerializer(GeoFeatureModelSerializer):
    city_set = serializers.StringRelatedField(many=True)

    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['url', 'name', 'city_set']
