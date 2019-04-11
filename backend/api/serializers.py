from rest_framework import serializers
from rest_framework_gis.serializers import (
    GeoFeatureModelSerializer, GeometryField
)

from .models import City, Capital, Country, Image, CountriesHelper


#
# Auth
#
class UserSigninSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


#
# Country
#
class CountrySerializer(GeoFeatureModelSerializer):
    capital = serializers.PrimaryKeyRelatedField(read_only=True)
    city_set = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'capital', 'city_set']


class CountryGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id']


# Helpers
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
# /Helpers


class CountryInfoSerializer(serializers.ModelSerializer):
    city_set = CityInfoHelperSerializer(many=True)
    capital = CapitalInfoHelperSerializer()

    class Meta:
        model = Country
        fields = ['id', 'name', 'capital', 'city_set']


#
# City
#
class CitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'country', 'description', 'image_set']


class CityGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id']


# Helpers
class CountryInfoHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class ImageInfoHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'image']
# /Helpers


class CityInfoSerializer(serializers.ModelSerializer):
    country = CountryInfoHelperSerializer()
    images = ImageInfoHelperSerializer(source='image_set', many=True)

    class Meta:
        model = City
        fields = ['name', 'country', 'description', 'images']


class CityPUTSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['name', 'country', 'description']


#
# Capital
#
class CapitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capital
        fields = ['url', 'city', 'capital_of']


#
# CountriesHelper
#
class CountriesHelperSerializer(serializers.ModelSerializer):
    geometry = GeometryField(write_only=True)

    class Meta:
        model = CountriesHelper
        fields = ['id', 'name', 'geometry']


class CountriesHelperDetailSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CountriesHelper
        geo_field = 'geometry'
        fields = ['id', 'name']
