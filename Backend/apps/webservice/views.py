from django.shortcuts import render

def upload_test(request):
	return render(request, 'upload_test.html')