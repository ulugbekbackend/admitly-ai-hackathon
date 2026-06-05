from django.contrib import admin
from .models import EssayAnalysis


@admin.register(EssayAnalysis)
class EssayAnalysisAdmin(admin.ModelAdmin):
    list_display = ('application', 'overall_score', 'match_level', 'word_count', 'created_at')
    list_filter = ('match_level',)
