from django.contrib.gis import admin

from .models import Country, City

admin.site.register(Country, admin.GeoModelAdmin)
admin.site.register(City, admin.GeoModelAdmin)
