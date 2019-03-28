from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import City, Country


class CountrySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Country
        geo_field = 'geometry'
        fields = ['url', 'name', 'city_set']


class CitySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = City
        geo_field = 'geometry'
        fields = ['url', 'name', 'description', 'country']
