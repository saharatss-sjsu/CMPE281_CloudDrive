from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import File
from .utils import (
	bytes_to_mib,
	file_generate_name,
	file_generate_upload_path,
)
from .connector import s3_generate_presigned_post
from django.contrib.auth.models import User

import mimetypes
from typing import Any, Dict, Tuple

def _validate_file_size(file_obj):
	max_size = settings.UPLOAD_MAX_FILE_SIZE
	if file_obj.size > max_size:
		raise ValidationError(f"File is too large. It should not exceed {bytes_to_mib(max_size)} MiB")


class FileDirectUploadService:
	def __init__(self, user: User):
		self.user = user
	@transaction.atomic
	def start(self, *, file_name: str, file_type: str) -> Dict[str, Any]:
		file = File(
				original_file_name=file_name,
				file_name=file_generate_name(file_name),
				file_type=file_type,
				owner=self.user,
				file=None,
		)
		file.full_clean()
		file.save()
		upload_path = file_generate_upload_path(file, file.file_name)
		file.file = file.file.field.attr_class(file, file.file.field, upload_path)
		file.save()
		presigned_data: Dict[str, Any] = {}
		presigned_data = s3_generate_presigned_post(file_path=upload_path, file_type=file.file_type)
		return {"id": file.id, **presigned_data}

	@transaction.atomic
	def finish(self, *, file: File) -> File:
		file.upload_finished_at = timezone.now()
		file.full_clean()
		file.save()
		return file