from django.contrib.auth import get_user_model
from rest_framework import serializers

from polls.models import Question, Choice


class UserSigninSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        User = get_user_model()
        model = User
        fields = ('url', 'username', 'email', 'first_name', 'last_name',
                  'patronymic', 'job')


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('url', 'question_text', 'pub_date', 'choice_set')


class ChoiceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Choice
        fields = ('url', 'question', 'choice_text', 'votes')
