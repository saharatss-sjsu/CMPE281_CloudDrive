from django.db import models
from django.contrib.auth.models import User
import uuid

from .connector import s3_object_delete

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

	def deleteFile(self):
		s3_object_delete(file_path=self.path)
		if self.type == 'image/jpeg' or self.type == 'image/png':
			s3_object_delete(file_path=f't_{self.path}')

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