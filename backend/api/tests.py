import json
import uuid

from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Polygon, Point
from rest_framework.test import APIClient

from core.models import User
from .models import Country, City


def create_test_user(username='test_user', password='qwerty12+'):
    u = User(username=username)
    u.set_password(password)
    u.save()
    return u


def create_country(name=None, geometry=Polygon()):
    if name is None:
        name = str(uuid.uuid4())

    c = Country(name=name, geometry=geometry)
    c.save()
    return c


def create_city(name=None, country=None, geometry=Point(0, 0)):
    if name is None:
        name = str(uuid.uuid4())
    if country is None:
        country = create_country()

    c = City(name=name, country=country, geometry=geometry)
    c.save()
    return c


class TokenAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.u = create_test_user()

    def test_token_auth(self):
        res = self.client.post(reverse('token-auth'), data={
            'username': 'test_user',
            'password': 'qwerty12+',
        })

        self.assertEqual(res.status_code, 200)

    def test_token_auth_with_bad_params(self):
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

    def test_auth_with_token_header(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.u.auth_token}')
        res = self.client.get(reverse('token-info'))

        self.assertEqual(res.status_code, 200)

    def test_auth_with_bad_token(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token test{self.u.auth_token}')
        res = self.client.get(reverse('token-info'))

        self.assertEqual(res.status_code, 401)


class CountryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.u = create_test_user()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.u.auth_token}')

    def test_get_list(self):
        c = create_country()

        res = self.client.get(reverse('country-list'))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()[0]['id'], c.id)
        self.assertEqual(res.json()[0]['name'], c.name)

    def test_get_detail(self):
        c = create_country()

        res = self.client.get(reverse('country-detail', args=[c.id]))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['id'], c.id)
        self.assertEqual(res.json()['name'], c.name)

    def test_get_geo(self):
        c = create_country()

        res = self.client.get(reverse('geo-country'))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['features'][0]['id'], c.id)
        self.assertIsNotNone(res.json()['features'][0]['geometry'])

    def test_post(self):
        res = self.client.post(reverse('country-list'), data=json.dumps({
            'name': 'test_country',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [0, 0],
                        [0, 1],
                        [1, 1],
                        [1, 0],
                        [0, 0],
                    ],
                    [
                        [0.4, 0.4],
                        [0.4, 0.6],
                        [0.6, 0.6],
                        [0.6, 0.4],
                        [0.4, 0.4],
                    ],
                ],
            }
        }), content_type='application/json')

        self.assertEqual(res.status_code, 201)

    def test_post_with_bad_params(self):
        res = self.client.post(reverse('country-list'), data=json.dumps({
            'name': 'test_country',
            'geom': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [0, 0],
                        [0, 1],
                        [1, 1],
                        [1, 0],
                        [0, 0],
                    ],
                    [
                        [0.4, 0.4],
                        [0.4, 0.6],
                        [0.6, 0.6],
                        [0.6, 0.4],
                        [0.4, 0.4],
                    ],
                ],
            }
        }), content_type='application/json')

        self.assertEqual(res.status_code, 400)

    def test_delete(self):
        c = create_country()

        res = self.client.delete(reverse('country-detail', args=[c.id]))

        self.assertEqual(res.status_code, 204)
        self.assertFalse(Country.objects.all())


class CityTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.u = create_test_user()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Token {self.u.auth_token}')

    def test_get(self):
        c = create_city()

        res = self.client.get(reverse('city-list'))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()[0]['id'], c.id)
        self.assertEqual(res.json()[0]['name'], c.name)
        self.assertEqual(res.json()[0]['country']['id'], c.country.id)

    def test_get_detail(self):
        c = create_city()

        res = self.client.get(reverse('city-detail', args=[c.id]))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['id'], c.id)
        self.assertEqual(res.json()['name'], c.name)
        self.assertEqual(res.json()['country']['id'], c.country.id)

    def test_get_geo(self):
        c = create_city()

        res = self.client.get(reverse('geo-city'))

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['features'][0]['id'], c.id)
        self.assertIsNotNone(res.json()['features'][0]['geometry'])

    def test_post(self):
        country = create_country()

        res = self.client.post(reverse('city-list'), data=json.dumps({
            'name': 'test_city',
            'country_': country.id,
            'geometry': {
                'type': 'Point',
                'coordinates': [0, 0],
            }
        }), content_type='application/json')

        self.assertEqual(res.status_code, 201)

    def test_post_with_bad_params(self):
        country = create_country()

        res = self.client.post(reverse('city-list'), data=json.dumps({
            'name': 'test_city',
            'country_': country.id,
            'geom': {
                'type': 'Point',
                'coordinates': [0, 0],
            }
        }), content_type='application/json')

        self.assertEqual(res.status_code, 400)

    def test_put(self):
        c = create_city()

        res = self.client.put(
            reverse('city-detail', args=[c.id]),
            data=json.dumps({
                'name': 'test_renamed_city',
                'country_': c.country.id,
                'geometry': {
                    'type': 'Point',
                    'coordinates': [0, 0],
                }}),
            content_type='application/json')

        self.assertEqual(res.status_code, 200)

    def test_put_with_invalid_params(self):
        c = create_city()

        res = self.client.put(
            reverse('city-detail', args=[c.id]),
            data=json.dumps({
                'name': 'test_renamed_city',
                'country_': c.country.id,
                'geom': {
                    'type': 'Point',
                    'coordinates': [0, 0],
                }}),
            content_type='application/json')

        self.assertEqual(res.status_code, 400)

    def test_delete(self):
        c = create_city()

        res = self.client.delete(reverse('city-detail', args=[c.id]))

        self.assertEqual(res.status_code, 204)
        self.assertFalse(City.objects.all())
