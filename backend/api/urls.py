from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('questions', views.QuestionViewSet)
router.register('choice', views.ChoiceViewSet)

urlpatterns = [
    path('auth/', include('rest_framework.urls', namespace='geo-auth')),
    path('token-auth/', views.signin),
    path('token-info/', views.user_info),
    path('', include(router.urls)),
]
