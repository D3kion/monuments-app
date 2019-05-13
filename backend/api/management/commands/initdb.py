import json

from django.contrib.gis.geos import GEOSGeometry
from django.core.management.base import BaseCommand

from api.models import CountriesHelper


class Command(BaseCommand):
    help = 'Initializes database with countries'

    def handle(self, *args, **kwargs):
        countries = json.load(
            open('./api/management/commands/countries.geo.json'))

        for x in countries.get('features'):
            name = x.get('properties').get('name')
            geom = GEOSGeometry(str(x.get('geometry')))

            CountriesHelper.objects.create(name=name, geometry=geom)
