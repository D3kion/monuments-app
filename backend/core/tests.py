from django.test import TestCase
from .models import User


class UserModelTestCase(TestCase):
    def setUp(self):
        self.u = User(username='test_user')
        self.u.set_password('qwerty12+')
        self.u.save()

    def test_fields(self):
        self.assertEqual(self.u.patronymic, '')
        self.assertEqual(self.u.job, '')

        self.u.patronymic = 'test_patronymic'
        self.u.job = 'test_job'

        self.assertEqual(self.u.patronymic, 'test_patronymic')
        self.assertEqual(self.u.job, 'test_job')

    def test_token_creation_on_user_creation(self):
        self.assertIsNotNone(self.u.auth_token)
