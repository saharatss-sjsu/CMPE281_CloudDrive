from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, viewsets

from rest_framework.decorators import api_view, action

import json

# Get users

class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['url', 'username', 'first_name', 'last_name']

class UserViewSet(viewsets.ModelViewSet):
	http_method_names = ["get"]
	queryset = User.objects.all()
	serializer_class = UserSerializer



# Authentication

@csrf_exempt
@require_http_methods(['POST'])
def auth_login(request):
	data = json.loads(request.body)
	username = data.get('username')
	password = data.get('password')
	user = authenticate(request, username=username, password=password)
	if user is not None:
		login(request, user)
		return JsonResponse({
			"success":True,
			"sessionid": request.session.session_key
		})
	return JsonResponse({"success":False, "msg":"Invalid username or password"}, status=401)

@csrf_exempt
@require_http_methods(['GET','POST','OPTIONS'])
def auth_logout(request):
	if request.user.is_authenticated:
		logout(request)
		return JsonResponse({"success":True})
	return JsonResponse({"success":False, "msg":"User not found"}, status=403)

# @login_required
def auth_test(request):
	print(request.user)
	return HttpResponse('ok')