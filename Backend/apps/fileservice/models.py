from django.db import models
from django.contrib.auth.models import User
import uuid

from .utils import file_generate_upload_path
from .connector import s3_object_delete

class File(models.Model):
	id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	file = models.FileField(upload_to=file_generate_upload_path, blank=True, null=True)

	original_file_name = models.TextField()

	file_name = models.CharField(max_length=255, unique=True)
	file_type = models.CharField(max_length=255)

	owner = models.ForeignKey(User, on_delete=models.CASCADE)

	datetime_created         = models.DateTimeField(auto_now_add=True)
	datetime_upload_finished = models.DateTimeField(blank=True, null=True)

	@property
	def is_valid(self):
		return bool(self.datetime_upload_finished)
	
	def delete(self, using=None, keep_parents=False):
		print('file delete', s3_object_delete(file_path=file_generate_upload_path(self)))
		super().delete()