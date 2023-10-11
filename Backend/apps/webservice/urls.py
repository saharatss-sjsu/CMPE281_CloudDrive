from django.urls import path

from . import views

urlpatterns = [
	path('upload_test', views.upload_test),
]