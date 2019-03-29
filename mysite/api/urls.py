from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('questions', views.QuestionViewSet)
router.register('choice', views.ChoiceViewSet)

urlpatterns = [
    path('auth/', include('rest_framework.urls', namespace='geo-auth')),
    path('api-token-auth/', tokenviews.obtain_auth_token),
    path('', include(router.urls)),
]