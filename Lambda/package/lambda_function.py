import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
from PIL import Image

s3_client = boto3.client('s3')
						
def resize_image(image_path, resized_path):
	with Image.open(image_path) as image:
		image.thumbnail((200,200))
		image.save(resized_path)
						
def lambda_handler(event, context):
	for record in event['Records']:
		bucket = record['s3']['bucket']['name']
		
		key = unquote_plus(record['s3']['object']['key'])
		file_name = os.path.basename(key)
		
		print('key', key)
		
		download_path = f'/tmp/{uuid.uuid4()}{file_name}'
		upload_path   = f'/tmp/resized-{file_name}'

		s3_client.download_file(bucket, key, download_path)
		resize_image(download_path, upload_path)
		s3_client.upload_file(upload_path, bucket, f'user_upload_t/{file_name}')


