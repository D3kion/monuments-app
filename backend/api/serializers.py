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
# Helpers
#
class CapitalHelperSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(source='city', read_only=True)
    name = serializers.StringRelatedField(source='city')

    class Meta:
        model = Capital
        fields = ['id', 'name']


class CityHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class CountryHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class ImageHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'image']


#
# Country
#
class CountrySerializer(serializers.ModelSerializer):
    # read_only
    capital = CapitalHelperSerializer(read_only=True)
    cities = CityHelperSerializer(source='city_set', read_only=True, many=True)

    # write_only
    capital_ = serializers.PrimaryKeyRelatedField(
        source='capital', write_only=True, required=False,
        queryset=Capital.objects.all())
    city_set = serializers.PrimaryKeyRelatedField(
        write_only=True, many=True, required=False,
        queryset=City.objects.all())
    geometry = GeometryField(write_only=True)

    class Meta:
        model = Country
        fields = ['id', 'url', 'name', 'capital', 'cities',
                  'capital_', 'city_set', 'geometry']


class CountryGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id']


#
# City
#
class CitySerializer(serializers.ModelSerializer):
    # read_only
    country = CountryHelperSerializer(read_only=True)
    images = ImageHelperSerializer(source='image_set', read_only=True,
                                   many=True)

    # write_only
    country_ = serializers.PrimaryKeyRelatedField(
        source='country', write_only=True, queryset=Country.objects.all())
    image_set = serializers.PrimaryKeyRelatedField(
        write_only=True, many=True, required=False,
        queryset=Image.objects.all())
    geometry = GeometryField(write_only=True)

    class Meta:
        model = City
        fields = ['id', 'url', 'name', 'country', 'description', 'images',
                  'country_', 'image_set', 'geometry']


class CityGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id']


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
