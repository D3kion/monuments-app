# Generated by Django 2.1.7 on 2019-03-29 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('geoapi', '0009_auto_20190328_1615'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='city',
            options={'verbose_name': 'city', 'verbose_name_plural': 'cities'},
        ),
        migrations.AlterModelOptions(
            name='country',
            options={'verbose_name': 'country', 'verbose_name_plural': 'countries'},
        ),
    ]