from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

def health_check(request):
	return HttpResponse(status=200)

def upload_test(request):
	return render(request, 'upload_test.html')