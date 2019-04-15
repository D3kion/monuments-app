from django.contrib.auth import authenticate
from rest_framework import viewsets, generics, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .authentication import token_expire_handler, expires_in
from .models import Country, Image, City, Capital, CountriesHelper
from .serializers import (
    UserSigninSerializer,
    CountrySerializer, ImageSerializer, CitySerializer, CapitalSerializer,
    CountryGeoSerializer, CityGeoSerializer,
    CountriesHelperSerializer, CountriesHelperDetailSerializer,
)


#
# Auth
#
@api_view(["GET"])
def user_info(request):
    return Response({
        'user': request.user.username,
        'expires_in': expires_in(Token.objects.get(user=request.user))
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes((AllowAny,))
def signin(request):
    signin_serializer = UserSigninSerializer(data=request.data)
    if not signin_serializer.is_valid():
        return Response(signin_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=signin_serializer.data['username'],
        password=signin_serializer.data['password'],
    )
    if not user:
        return Response({'detail': 'Invalid credentials'},
                        status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)

    is_expired, token = token_expire_handler(token)

    return Response({
        'token': token.key,
        'expires_in': expires_in(token),
    }, status=status.HTTP_200_OK)


#
# Country
#
class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CountryGeoView(generics.ListAPIView):
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountryGeoSerializer
    pagination_class = None


#
# Image
#
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('-id')
    serializer_class = ImageSerializer
    pagination_class = None


#
# City
#
class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('country.name').order_by('name')
    serializer_class = CitySerializer
    pagination_class = None
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CityGeoView(generics.ListAPIView):
    queryset = City.objects.all().order_by('id')
    serializer_class = CityGeoSerializer
    pagination_class = None


#
# Capital
#
class CapitalViewSet(viewsets.ModelViewSet):
    queryset = Capital.objects.all().order_by('capital_of')
    serializer_class = CapitalSerializer
    pagination_class = None


#
# CountriesHelper
#
class CountriesHelperView(generics.ListCreateAPIView):
    qs1 = Country.objects.values_list('name')
    qs2 = CountriesHelper.objects.values_list('name')
    qs = qs2.difference(qs1)
    queryset = CountriesHelper.objects.filter(name__in=qs).order_by('name')
    serializer_class = CountriesHelperSerializer
    pagination_class = None


class CountriesHelperDetailView(generics.RetrieveAPIView):
    queryset = CountriesHelper.objects.all().order_by('name')
    serializer_class = CountriesHelperDetailSerializer
    pagination_class = None
