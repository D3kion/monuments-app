from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point, Polygon
from django.core.management.base import BaseCommand

from polls.models import Question
from geoapi.models import Country, City


class Command(BaseCommand):
    help = 'Initialize db with sample data'

    def handle(self, *args, **kwargs):
        # Core
        User = get_user_model()
        User.objects.create_superuser('admin', '', 'qwerty12+')
        User.objects.create_user(username='user1', email='testing@tests.test',
                                 password='qwerty12+')
        User.objects.create_user(username='user2', email='test@testing.tests',
                                 password='qwerty12+')

        # Polls
        q = Question.objects.create(question_text='Dumb poll',
                                    pub_date=timezone.now())
        q.choice_set.create(choice_text="Who's dumb?!")

        q = Question.objects.create(question_text='Make polls great again?',
                                    pub_date=timezone.now())
        q.choice_set.create(choice_text="Yeah, let's do this")
        q.choice_set.create(choice_text="Nah, we don't need that")

        # GeoAPI
        c = Country.objects.create(name='Russia', geometry=Polygon([
            (0, 0), (0, 1), (1, 1), (1, 0), (0, 0),
        ]))
        City.objects.create(name='Moscow', description='Capital of Russia',
                            country=c, geometry=Point([0.5, 0.5]))
        City.objects.create(name='Rostov-on-Don', country=c,
                            geometry=Point([0.25, 0.25]))
