from django.db import transaction
from django.utils import timezone

from .models import File

from .connector import s3_generate_presigned_post
from django.contrib.auth.models import User

from typing import Any, Dict, Tuple

import pathlib
import uuid

def file_generate_upload_path(file_name):
	extension = pathlib.Path(file_name).suffix
	return f"files/{uuid.uuid4().hex}{extension}"

class FileDirectUploadService:
	def __init__(self, user: User):
		self.user = user

	@transaction.atomic
	def start(self, file_name:str, file_type:str, file_size:int) -> Dict[str, Any]:
		file = File(
			name=file_name,
			type=file_type,
			size=file_size,
			owner=self.user,
			path=file_generate_upload_path(file_name),
		)
		file.save()
		presigned_data: Dict[str, Any] = {}
		presigned_data = s3_generate_presigned_post(file_path=file.path, file_type=file.type)
		return {"file": file.dict(), **presigned_data}
	
	@transaction.atomic
	def finish(self, *, file: File) -> File:
		file.uploaded = timezone.now()
		file.full_clean()
		file.save()
		return file