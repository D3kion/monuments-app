import datetime

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    patronymic = models.CharField(max_length=50, blank=True,
                                  verbose_name=_('Patronymic'))
    job = models.CharField(max_length=200, blank=True,
                           verbose_name=_('Job'))


class Question(models.Model):
    question_text = models.CharField(max_length=200,
                                     verbose_name=_('Question text'))
    pub_date = models.DateTimeField(_('Date published'))

    def __str__(self):
        return self.question_text

    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = _('Published recently?')

    class Meta:
        verbose_name = _('Question')
        verbose_name_plural = _('Questions')


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE,
                                 verbose_name=_('Question'))
    choice_text = models.CharField(max_length=200,
                                   verbose_name=_('Choice text'))
    votes = models.IntegerField(default=0, verbose_name=_('Votes'))

    def __str__(self):
        return self.choice_text

    class Meta:
        verbose_name = _('Choice')
        verbose_name_plural = _('Choices')
