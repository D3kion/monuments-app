from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('questions', views.QuestionViewSet)
router.register('choice', views.ChoiceViewSet)

urlpatterns = [
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(router.urls)),
]
