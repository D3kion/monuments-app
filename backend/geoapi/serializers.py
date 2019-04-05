from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Capital, Country, Image, CountriesHelper


class CountrySerializer(GeoFeatureModelSerializer):
    capital = serializers.PrimaryKeyRelatedField(read_only=True)
    city_set = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'capital', 'city_set']


class CitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['id', 'url', 'name', 'country', 'description', 'image_set']


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


class ImageInfoHelperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'image']


class CityInfoSerializer(serializers.ModelSerializer):
    country = CountryInfoHelperSerializer()
    images = ImageInfoHelperSerializer(source='image_set', many=True)

    class Meta:
        model = City
        fields = ['name', 'country', 'description', 'images']


#
# CountriesHelper
#
class CountriesHelperSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CountriesHelper
        geo_field = 'geometry'
        fields = ['id', 'name']


class CountriesHelperListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountriesHelper
        fields = ['id', 'name']
