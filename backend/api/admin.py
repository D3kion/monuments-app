from django.contrib.gis import admin
from django.contrib.auth.models import Group

from .models import Country, City, Capital, Image

admin.site.unregister(Group)

admin.site.register(Country, admin.GeoModelAdmin)
admin.site.register(City, admin.GeoModelAdmin)
admin.site.register(Capital)
admin.site.register(Image)
