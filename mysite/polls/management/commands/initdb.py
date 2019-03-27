from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from polls.models import Question


class Command(BaseCommand):
    help = 'Initialize db with sample data'

    def handle(self, *args, **kwargs):
        q = Question.objects.create(question_text='Dumb poll',
                                    pub_date=timezone.now())
        q.choice_set.create(choice_text="Who's dumb?!")

        q = Question.objects.create(question_text='Make polls great again?',
                                    pub_date=timezone.now())
        q.choice_set.create(choice_text="Yeah, let's do this")
        q.choice_set.create(choice_text="Nah, we don't need that")

        User = get_user_model()
        User.objects.create_superuser('admin', '', 'qwerty12+')
        User.objects.create_user(username='user1', email='testing@tests.test',
                                 password='qwerty12+')
        User.objects.create_user(username='user2', email='test@testing.tests',
                                 password='qwerty12+')
