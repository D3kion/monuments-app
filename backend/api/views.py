from django.contrib.auth import get_user_model, authenticate
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
)
from rest_framework.response import Response

from polls.models import Question, Choice
from .serializers import (
    UserSerializer,
    UserSigninSerializer,
    QuestionSerializer,
    ChoiceSerializer,
)
from .authentication import token_expire_handler, expires_in


@api_view(["GET"])
def user_info(request):
    return Response({
        'user': request.user.username,
        'expires_in': expires_in(Token.objects.get(user=request.user))
    }, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes((AllowAny,))
def signin(request):
    signin_serializer = UserSigninSerializer(data=request.data)
    if not signin_serializer.is_valid():
        return Response(signin_serializer.errors, status=HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=signin_serializer.data['username'],
        password=signin_serializer.data['password'],
    )
    if not user:
        return Response({'detail': 'Invalid credentials'},
                        status=HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)

    is_expired, token = token_expire_handler(token)
    user_serialized = UserSerializer(user, context={'request': request})

    return Response({
        'user': user_serialized.data,
        'expires_in': expires_in(token),
        'token': token.key
    }, status=HTTP_200_OK)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    User = get_user_model()
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-pub_date')
    serializer_class = QuestionSerializer


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
