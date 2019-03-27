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
