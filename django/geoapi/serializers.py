from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Capital, Country


class CountrySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'capital', 'city_set']


class CitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'country', 'description']


class CapitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capital
        fields = ['url', 'city', 'capital_of']


class CountryGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id']


class CityGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id']


class CityInfoHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class CapitalInfoHelperSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(source='city', read_only=True)
    name = serializers.StringRelatedField(source='city')

    class Meta:
        model = Capital
        fields = ['id', 'name']


class CountryInfoSerializer(serializers.ModelSerializer):
    city_set = CityInfoHelperSerializer(many=True)
    capital = CapitalInfoHelperSerializer()

    class Meta:
        model = Country
        fields = ['name', 'capital', 'city_set']


class CountryInfoHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class CityInfoSerializer(serializers.ModelSerializer):
    country = CountryInfoHelperSerializer()

    class Meta:
        model = City
        fields = ['name', 'country', 'description']  # +photos
