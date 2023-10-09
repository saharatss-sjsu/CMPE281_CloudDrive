from django.urls import include, path

from . import apis

urlpatterns = [
	path('login/', apis.auth_login),
	path('logout/', apis.auth_logout),
	path('test/', apis.auth_test),
]
