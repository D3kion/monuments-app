from django.contrib.gis.db import models


class Country(models.Model):
    name = models.CharField(max_length=50)
    geometry = models.PolygonField()

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # photos
    country = models.ForeignKey(Country, on_delete=models.DO_NOTHING,
                                null=True)  # Need review
    geometry = models.PointField()

    def __str__(self):
        return self.name

# Need review
# class Capital(City):
#     capital_of = models.OneToOneField(Country, on_delete=models.DO_NOTHING)
