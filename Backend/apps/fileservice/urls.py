from django.urls import include, path

from . import apis

urlpatterns = [
	path("upload/",
		include([
			path("start/", apis.FileDirectUploadStartApi, name="start"),
			path("finish/", apis.FileDirectUploadFinishApi, name="finish"),
		]),
	),
]