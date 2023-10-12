from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.conf import settings

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import serializers, viewsets

from .models import File
from .services import FileDirectUploadService

import json
import uuid

@csrf_exempt
@require_http_methods(["POST"])
def FileDirectUploadStart(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try: data = json.loads(request.body)
	except: return HttpResponse(status=400)
	file_name = data.get('name')
	file_type = data.get('type')
	file_size = data.get('size')
	if file_size > settings.UPLOAD_MAX_FILE_SIZE: return HttpResponse(f"{file_name} is too large", status=406)
	service = FileDirectUploadService(request.user)
	presigned_data = service.start(file_name, file_type, file_size)
	return JsonResponse(data=presigned_data)

@csrf_exempt
@require_http_methods(["POST"])
def FileDirectUploadFinish(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try:
		data = json.loads(request.body)
		file_id = uuid.UUID(data.get('id'))
	except: return HttpResponse(status=400)
	file = get_object_or_404(File, id=file_id)
	if file.owner != request.user: return HttpResponse(status=403)
	service = FileDirectUploadService(request.user)
	service.finish(file=file)
	return JsonResponse({"file": file.dict()})

@csrf_exempt
@require_http_methods(["POST"])
def FileReplaceUploadStart(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try:
		data = json.loads(request.body)
		file_id = uuid.UUID(data.get('id'))
		file_name = data.get('name')
		file_type = data.get('type')
		file_size = data.get('size')
	except: return HttpResponse(status=400)
	file = get_object_or_404(File, id=file_id)
	if file_type != file.type: return HttpResponse("File type must be the same", status=406)
	if file_size > settings.UPLOAD_MAX_FILE_SIZE: return HttpResponse(f"{file.name} is too large", status=406)
	file.deleteFile()
	file.size = file_size
	file.save()
	service = FileDirectUploadService(request.user)
	presigned_data = service.replace(file)
	return JsonResponse(data=presigned_data)

def FileGetList(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	files = File.objects.filter(owner=request.user)
	return JsonResponse({"files": list(map(lambda x: x.dict(), files))})

def FileGet(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try:
		data = json.loads(request.body)
		file_id = uuid.UUID(data.get('id'))
	except: return HttpResponse(status=400)
	try: file = File.objects.get(id=file_id)
	except File.DoesNotExist: return HttpResponse(status=404)
	if file.owner != request.user: return HttpResponse(status=403)
	return JsonResponse({"file": file.dict()})

@csrf_exempt
@require_http_methods(["DELETE"])
def FileDelete(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try:
		data = json.loads(request.body)
		file_id = uuid.UUID(data.get('id'))
	except: return HttpResponse(status=400)
	try: file = File.objects.get(id=file_id)
	except File.DoesNotExist: return HttpResponse(status=404)
	if file.owner != request.user: return HttpResponse(status=403)
	file.delete()
	return JsonResponse({"id": file_id})

@csrf_exempt
@require_http_methods(["PUT"])
def FileEdit(request):
	if not request.user.is_authenticated: return HttpResponse(status=401)
	try:
		data = json.loads(request.body)
		file_id = uuid.UUID(data.get('id'))
	except: return HttpResponse(status=400)
	try: file = File.objects.get(id=file_id)
	except File.DoesNotExist: return HttpResponse(status=404)
	if file.owner != request.user: return HttpResponse(status=403)
	file.name = data.get('name')
	file.note = data.get('note')
	file.save()
	return JsonResponse({"file": file.dict()})
