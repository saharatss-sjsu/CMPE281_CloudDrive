from django.urls import include, path

from . import apis

urlpatterns = [
	path('login/', apis.auth_login),
	path('logout/', apis.auth_logout),
	path('register/', apis.auth_register),
	path('me/get/', apis.user_me_get),
	path('me/edit/', apis.user_me_edit),
	path('me/password/', apis.user_me_changepassword),
]
