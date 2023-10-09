from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import File
from .services import (
	FileDirectUploadService,
)

import json

@csrf_exempt
@require_http_methods(["POST"])
def FileDirectUploadStartApi(request, *args, **kwargs):
	data = json.loads(request.body)
	file_name = data.get('file_name')
	file_type = data.get('file_type')
	service = FileDirectUploadService(request.user)
	presigned_data = service.start(file_name=file_name, file_type=file_type)
	print(presigned_data)
	return JsonResponse(data=presigned_data)

@csrf_exempt
@require_http_methods(["POST"])
def FileDirectUploadFinishApi(request):
	data = json.loads(request.body)
	print(data)
	file_id = data.get('file_id')
	file = get_object_or_404(File, id=file_id)
	service = FileDirectUploadService(request.user)
	service.finish(file=file)
	return JsonResponse({"id": file.id})