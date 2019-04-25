from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


class User(AbstractUser):
    patronymic = models.CharField(max_length=50, blank=True,
                                  verbose_name=_('Patronymic'))
    job = models.CharField(max_length=200, blank=True,
                           verbose_name=_('Job'))


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
