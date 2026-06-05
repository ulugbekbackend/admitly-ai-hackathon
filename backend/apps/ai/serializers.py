from rest_framework import serializers
from .models import EssayAnalysis


class EssayAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = EssayAnalysis
        fields = (
            'id', 'application', 'overall_score', 'match_level',
            'summary_uz', 'word_count', 'annotations',
            'missing_uz', 'strengths_uz', 'breakdown', 'created_at',
        )
        read_only_fields = fields


class EssayAnalysisListSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='application.program.name', read_only=True)
    program_flag = serializers.CharField(source='application.program.flag_emoji', read_only=True)

    class Meta:
        model = EssayAnalysis
        fields = (
            'id', 'application', 'overall_score', 'match_level',
            'summary_uz', 'word_count', 'essay_text', 'annotations',
            'missing_uz', 'strengths_uz', 'breakdown', 'created_at',
            'program_name', 'program_flag',
        )
        read_only_fields = fields
