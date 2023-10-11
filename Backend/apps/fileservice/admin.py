from django.contrib import admin

from . import models

class FileAdmin(admin.ModelAdmin):
	list_display = ('id', 'path', 'name', 'type', 'owner', 'created', 'uploaded','updated')
	ordering = ('created',)
	list_filter = ('owner','type')
admin.site.register(models.File, FileAdmin)