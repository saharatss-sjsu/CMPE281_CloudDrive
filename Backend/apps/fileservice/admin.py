from django.contrib import admin

from . import models

class FileAdmin(admin.ModelAdmin):
	list_display = ('id', 'original_file_name', 'file_name', 'file_type', 'owner', 'datetime_created', 'datetime_upload_finished')
	ordering = ('datetime_created',)
	# list_filter = ('gender',)
admin.site.register(models.File, FileAdmin)