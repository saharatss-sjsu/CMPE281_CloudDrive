"""CMPE281_CloudDrive URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from rest_framework import routers, serializers, viewsets
router = routers.DefaultRouter()

from apps.userservice import apis as userservice_apis
router.register('users', userservice_apis.UserViewSet)
# router.register('auth', userservice_apis.Auth.as_view(), basename='auth')

urlpatterns = [
	path('', include('apps.webservice.urls')),
	path('api/', include(router.urls)),
	path('api/auth/', include('apps.userservice.urls')),
	path('api/files/', include('apps.fileservice.urls')),
	path('admin/', admin.site.urls),
]
