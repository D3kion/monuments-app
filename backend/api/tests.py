from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Polygon

from core.models import User
from .models import Country


def create_test_user(username='test_user', password='qwerty12+'):
    u = User(username=username)
    u.set_password(password)
    u.save()
    return u


def create_country(name='test_country', geometry=Polygon()):
    c = Country(name=name, geometry=geometry)
    c.save()
    return c


class TokenAuthTestCase(TestCase):
    def setUp(self):
        self.u = create_test_user()

    def test_token_auth(self):
        res = self.client.post(reverse('token-auth'), data={
            'username': 'test_user',
            'password': 'qwerty12+',
        })

        self.assertEqual(res.status_code, 200)

    def test_token_auth_with_bad_parametrs(self):
        res = self.client.post(reverse('token-auth'), data={
            'user': 'test_user',
            'password': 'qwerty12+',
        })

        self.assertEqual(res.status_code, 400)

    def test_token_auth_with_invalid_credentials(self):
        res = self.client.post(reverse('token-auth'), data={
            'username': 'test_user',
            'password': 'qwerty12-',
        })

        self.assertEqual(res.status_code, 400)


class CountryTestCase(TestCase):
    def setUp(self):
        self.u = create_test_user()
        self.client.login(username='test_user', password='qwerty12+')

    def test_get_list(self):
        c1 = create_country()
        c2 = create_country(name='test_country2')

        res = self.client.get(reverse('country-list'))

        self.assertEqual(res.status_code, 200)

        self.assertEqual(res.json()[0]['id'], c1.id)
        self.assertEqual(res.json()[0]['name'], c1.name)
        self.assertEqual(res.json()[1]['id'], c2.id)
        self.assertEqual(res.json()[1]['name'], c2.name)

    def test_get_detail(self):
        c = create_country()

        res = self.client.get(reverse('country-list'))

        self.assertEqual(res.status_code, 200)

        self.assertEqual(res.json()[0]['id'], c.id)
        self.assertEqual(res.json()[0]['name'], c.name)

    def test_get_geo(self):
        c1 = create_country()
        c2 = create_country(name='test_country2')

        res = self.client.get(reverse('geo-country'))

        self.assertEqual(res.status_code, 200)

        self.assertEqual(res.json()['features'][0]['id'], c1.id)
        self.assertIsNotNone(res.json()['features'][0]['geometry'])
        self.assertEqual(res.json()['features'][1]['id'], c2.id)
        self.assertIsNotNone(res.json()['features'][1]['geometry'])
