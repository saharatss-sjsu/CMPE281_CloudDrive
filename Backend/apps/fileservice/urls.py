from django.urls import include, path

from . import apis

urlpatterns = [
	path("upload/",
		include([
			path("start/", apis.FileDirectUploadStart),
			path("finish/", apis.FileDirectUploadFinish),
		]),
	),
	path("getlist/", apis.FileGetList),
	path("get/", apis.FileGet),
	path("edit/", apis.FileEdit),
	path("delete/", apis.FileDelete),
]