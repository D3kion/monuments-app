from django.contrib.gis.db import models


class Country(models.Model):
    name = models.CharField(max_length=50)
    geometry = models.PolygonField()


class City(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # photos
    country = models.ForeignKey(Country, on_delete=models.DO_NOTHING)
    geometry = models.PointField()

    def __str__(self):
        return self.name


# class Capital(City):
#     capital_of = models.OneToOneField(Country, on_delete=models.DO_NOTHING)


# class Capital:
#     pass
