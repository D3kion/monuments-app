from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSigninSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        User = get_user_model()
        model = User
        fields = ('url', 'username', 'email', 'first_name', 'last_name',
                  'patronymic', 'job')
