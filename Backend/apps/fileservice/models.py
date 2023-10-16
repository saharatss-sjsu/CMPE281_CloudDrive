from django.db import models
from django.contrib.auth.models import User
import uuid

from .connector import s3_object_delete

class FileModelQuerySet(models.query.QuerySet):
	def delete(self):
		for obj in self.all():
			obj.delete()

class File(models.Model):
	id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	type = models.CharField(max_length=255)
	path = models.CharField(max_length=255, unique=True)
	size = models.IntegerField()
	note = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE)

	created  = models.DateTimeField(auto_now_add=True)
	updated  = models.DateTimeField(auto_now=True)
	uploaded = models.DateTimeField(blank=True, null=True)

	objects = FileModelQuerySet.as_manager()

	def deleteFile(self):
		s3_object_delete(file_path=self.path)
		if self.type == 'image/jpeg' or self.type == 'image/png':
			s3_object_delete(file_path=f'user_upload_t/{self.path.split("/")[-1]}')

	def delete(self, using=None, keep_parents=False):
		self.deleteFile()
		super().delete()

	def dict(self):
		return {
			'id': self.id,
			'path': self.path,
			'name': self.name,
			'type': self.type,
			'size': self.size,
			'note': self.note,
			'owner': {
				'id': self.owner.id,
				'username':   self.owner.username,
				'first_name': self.owner.first_name,
				'last_name':  self.owner.last_name,
			},
			'created': self.created,
			'updated': self.updated,
			'uploaded': self.uploaded,
		}