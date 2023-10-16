"""
Django settings for CMPE281_CloudDrive project.

Generated by 'django-admin startproject' using Django 3.2.9.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path

import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-0$mx##%y1=$n-x(5g$1&wu)@+yl7#ep_l+1h5x$_az$hnhgq%+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

print(f'DEBUG={DEBUG}')

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
	'apps.fileservice',
	'apps.webservice',
	'apps.userservice',

	'corsheaders',

	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
]

MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',

	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'CMPE281_CloudDrive.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'CMPE281_CloudDrive.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# DATABASES = {
# 	'default': {
# 		'ENGINE': 'django.db.backends.sqlite3',
# 		'NAME': BASE_DIR / 'db.sqlite3',
# 	}
# }

DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.mysql",
		"OPTIONS": {
			"read_default_file": os.path.join(BASE_DIR, 'credentials/mysql.cnf'),
		},
	}
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

if DEBUG == True:
	STATIC_URL = '/static/'
else:
	STATIC_URL = 'https://d2r279wybcc8qg.cloudfront.net/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Security

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
	"http://localhost:3000",
]
CORS_ALLOW_HEADERS = [
	"Access-Control-Allow-Origin",
	"Cookie",
]

# Auth

LOGIN_URL = '/'

SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_AGE = 60*60*24 # 24hr

# Rest

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': [
		'rest_framework.authentication.BasicAuthentication',
		'rest_framework.authentication.SessionAuthentication',
	]
}

# AWS S3

UPLOAD_MAX_FILE_SIZE = 10*10**6 # 10MB

AWS_S3_ACCESS_KEY_ID     = os.environ["AWS_S3_ACCESS_KEY_ID"]
AWS_S3_SECRET_ACCESS_KEY = os.environ["AWS_S3_SECRET_ACCESS_KEY"]
AWS_S3_BUCKET_NAME       = os.environ["AWS_S3_BUCKET_NAME"]
AWS_S3_REGION_NAME       = os.environ["AWS_S3_REGION_NAME"]
AWS_S3_SIGNATURE_VERSION = os.environ["AWS_S3_SIGNATURE_VERSION"]

AWS_DEFAULT_ACL          = os.environ.get("AWS_DEFAULT_ACL", default="private")
AWS_PRESIGNED_EXPIRY     = int(os.environ.get("AWS_PRESIGNED_EXPIRY", default=10))  # seconds