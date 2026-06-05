from django.contrib import admin
from .models import Program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('flag_emoji', 'name', 'type', 'country', 'deadline', 'min_gpa', 'min_ielts')
    list_filter = ('type', 'country')
    search_fields = ('name', 'country')
