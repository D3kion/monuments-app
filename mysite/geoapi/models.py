from django.contrib.gis.db import models


class Country(models.Model):
    name = models.CharField(max_length=50)
    geometry = models.PolygonField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'country'
        verbose_name_plural = 'countries'


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # photos
    country = models.ForeignKey(Country, on_delete=models.DO_NOTHING,
                                null=True)
    geometry = models.PointField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'city'
        verbose_name_plural = 'cities'


# class Capital(City):
#     capital_of = models.OneToOneField(Country, on_delete=models.DO_NOTHING)
