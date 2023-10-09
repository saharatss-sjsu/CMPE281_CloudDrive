from django.conf import settings

import boto3


def s3_get_client():
	return boto3.client(
		service_name="s3",
		aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
		aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
		region_name=settings.AWS_S3_REGION_NAME
	)


def s3_generate_presigned_post(*, file_path: str, file_type: str):
	s3_client = s3_get_client()

	acl = settings.AWS_DEFAULT_ACL
	expires_in = settings.AWS_PRESIGNED_EXPIRY

	presigned_data = s3_client.generate_presigned_post(
		settings.AWS_S3_BUCKET_NAME,
		file_path,
		Fields={
				"acl": acl,
				"Content-Type": file_type
		},
		Conditions=[
				{"acl": acl},
				{"Content-Type": file_type},
		],
		ExpiresIn=expires_in,
	)
	return presigned_data

def s3_object_delete(*, file_path: str):
	s3_client = s3_get_client()
	return s3_client.delete_object(
		Bucket=settings.AWS_S3_BUCKET_NAME, 
		Key=file_path)