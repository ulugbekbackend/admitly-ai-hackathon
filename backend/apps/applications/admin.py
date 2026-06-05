from django.contrib import admin
from .models import Application, Document


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'program', 'status', 'match_score', 'created_at')
    list_filter = ('status',)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('application', 'doc_type', 'status', 'created_at')
    list_filter = ('status',)
