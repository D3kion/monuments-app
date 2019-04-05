from django.contrib.gis import admin

from .models import Country, City, Capital, Image

admin.site.register(Country, admin.GeoModelAdmin)
admin.site.register(City, admin.GeoModelAdmin)
admin.site.register(Capital)
admin.site.register(Image)
