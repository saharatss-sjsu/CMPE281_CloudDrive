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

def user_serialize(user):
	return {
			"username": user.username,
			"first_name": user.first_name,
			"last_name": user.last_name,
		}

@csrf_exempt
@require_http_methods(['POST'])
def auth_login(request):
	data = json.loads(request.body)
	username = data.get('username')
	password = data.get('password')
	user = authenticate(request, username=username, password=password)
	if user is None: return JsonResponse({"success":False, "msg":"Invalid username or password"}, status=401)
	login(request, user)
	return JsonResponse({
		"success":True,
		"sessionid": request.session.session_key,
		"user": user_serialize(user)
	})

@csrf_exempt
@require_http_methods(['GET','POST','OPTIONS'])
def auth_logout(request):
	if not request.user.is_authenticated: return JsonResponse({"success":False, "msg":"User not found"}, status=401)
	logout(request)
	return JsonResponse({"success":True})
	

@csrf_exempt
@require_http_methods(['POST'])
def auth_register(request):
	data = json.loads(request.body)
	first_name = data.get('first_name','')
	last_name  = data.get('last_name','')
	username = data.get('username','')
	password = data.get('password','')
	if len(username) == 0: return JsonResponse({"success":False, "msg":"The username cannot be empty"}, status=403)
	if len(password) <= 1: return JsonResponse({"success":False, "msg":"The password cannot be empty"}, status=403)
	if User.objects.filter(username=username).count() != 0: return JsonResponse({"success":False, "msg":"The username already exists"}, status=403)
	user = User.objects.create_user(
		username=username,
		first_name=first_name,
		last_name=last_name)
	user.set_password(password)
	user.save()
	login(request, user)
	return JsonResponse({
		"success":True,
		"sessionid": request.session.session_key,
		"user": user_serialize(user)
	})

@csrf_exempt
@require_http_methods(['GET','POST'])
def user_me_get(request):
	if not request.user.is_authenticated: return JsonResponse({"success":False}, status=401)
	return JsonResponse({
		"success":True,
		"sessionid": request.session.session_key,
		"user":user_serialize(request.user),
	})

@csrf_exempt
@require_http_methods(['GET','POST'])
def user_me_edit(request):
	if not request.user.is_authenticated: return JsonResponse({"success":False}, status=404)
	data = json.loads(request.body)
	user = request.user
	user.first_name = data.get('first_name')
	user.last_name = data.get('last_name')
	username = data.get('username')
	if username != user.username:
		if User.objects.filter(username=username).count() != 0: return JsonResponse({"success":False, "msg":"The username has already been taken"}, status=403)
		user.username = username
	user.save()
	return JsonResponse({"success":True, "user":user_serialize(request.user)})

@csrf_exempt
@require_http_methods(['GET','POST'])
def user_me_changepassword(request):
	if not request.user.is_authenticated: return JsonResponse({"success":False}, status=404)
	data = json.loads(request.body)
	password = data.get('password','')
	if len(password) <= 1: return JsonResponse({"success":False, "msg":"The password cannot be empty"}, status=403)
	user = request.user
	user.set_password(password)
	user.save()
	return JsonResponse({"success":True, "user":user_serialize(request.user)})