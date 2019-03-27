from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    patronymic = models.CharField(max_length=50, blank=True,
                                  verbose_name=_('Patronymic'))
    job = models.CharField(max_length=200, blank=True,
                           verbose_name=_('Job'))
