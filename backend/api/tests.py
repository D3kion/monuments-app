from django.test import TestCase
from django.urls import reverse

from core.models import User


# Views
class AuthTestCase(TestCase):
    def setUp(self):
        self.u = User(username='test_user')
        self.u.set_password('qwerty12+')
        self.u.save()

    def test_token_auth(self):
        data = {
            'username': 'test_user',
            'password': 'qwerty12+',
        }

        res = self.client.post(reverse('token-auth'), data)
        self.assertEqual(res.status_code, 200)

    def test_token_auth_with_bad_parametrs(self):
        data = {
            'user': 'test_user',
            'password': 'qwerty12+',
        }

        res = self.client.post(reverse('token-auth'), data)
        self.assertEqual(res.status_code, 400)

    def test_token_auth_with_invalid_credentials(self):
        data = {
            'username': 'test_user',
            'password': 'qwerty12-',
        }

        res = self.client.post(reverse('token-auth'), data)
        self.assertEqual(res.status_code, 400)
