from django.urls import path

from . import views

urlpatterns = [
	path('health', views.health_check),
	path('upload_test', views.upload_test),
]