from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse

from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['url', 'username', 'first_name', 'last_name']

class UserViewSet(viewsets.ModelViewSet):
	http_method_names = ["get"]
	queryset = User.objects.all()
	serializer_class = UserSerializer

