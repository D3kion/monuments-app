from django.contrib.admin import ModelAdmin
from django.contrib.auth.models import Group
from django.contrib.gis import admin

from .models import Capital, City, Country, Image


class CityAdmin(admin.GeoModelAdmin):
    list_display = ['name', 'country']


class CapitalAdmin(ModelAdmin):
    list_display = ['city', 'capital_of']


admin.site.unregister(Group)

admin.site.register(Country, admin.GeoModelAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Capital, CapitalAdmin)
admin.site.register(Image)
