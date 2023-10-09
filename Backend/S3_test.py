import boto3

AWS_S3_ACCESS_KEY_ID     = "AKIATLOLONNQTN6JNR5W"
AWS_S3_SECRET_ACCESS_KEY = "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"
AWS_STORAGE_BUCKET_NAME  = "saharat-cmpe281-clouddrive"
AWS_S3_REGION_NAME       = "us-west-1"
AWS_S3_SIGNATURE_VERSION = ""

client = boto3.client(
	service_name="s3",
	aws_access_key_id=AWS_S3_ACCESS_KEY_ID,
	aws_secret_access_key=AWS_S3_SECRET_ACCESS_KEY,
	region_name=AWS_S3_REGION_NAME
)

response = client.list_objects_v2(
	Bucket=AWS_STORAGE_BUCKET_NAME,
	MaxKeys=10
)

print(response)