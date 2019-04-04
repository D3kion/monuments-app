from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Capital, Country


class CitySerializer(GeoFeatureModelSerializer):
    country_name = serializers.StringRelatedField(source='country')

    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['url', 'country',
                  'name', 'description', 'country_name']


class CapitalSerializer(serializers.ModelSerializer):
    city_name = serializers.StringRelatedField(source='city')
    capital_name = serializers.StringRelatedField(source='capital_of')

    class Meta:
        model = Capital
        fields = ['url', 'city', 'capital_of',
                  'city_name', 'capital_name']


class CountrySerializer(GeoFeatureModelSerializer):
    cities = serializers.StringRelatedField(source='city_set', many=True)
    capital_name = serializers.StringRelatedField(source='capital')

    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['url', 'city_set', 'capital',
                  'name', 'capital_name', 'cities']
