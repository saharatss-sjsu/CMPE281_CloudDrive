from django.contrib import admin
from django.utils.html import format_html

from . import models

class FileAdmin(admin.ModelAdmin):
	def filesize(self, obj):
		input = obj.size
		if input > 10**6: return format_html(f'<span style="white-space:nowrap;">{round(input/10**6)} MB</span>');
		if input > 10**3: return format_html(f'<span style="white-space:nowrap;">{round(input/10**3)} KB</span>');
		return                   format_html(f'<span style="white-space:nowrap;">{input} bytes');
	
	list_display = ('id', 'path', 'name', 'type', 'filesize', 'owner', 'created', 'uploaded','updated')
	ordering = ('created',)
	list_filter = ('owner','type')
admin.site.register(models.File, FileAdmin)