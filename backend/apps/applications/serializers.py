from rest_framework import serializers
from .models import Application, Document


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ('id', 'application', 'doc_type', 'file', 'file_url', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'application', 'file_url', 'created_at', 'updated_at')
        extra_kwargs = {'file': {'required': False}}

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def validate_file(self, value):
        if value:
            max_size = 10 * 1024 * 1024  # 10 MB
            if value.size > max_size:
                raise serializers.ValidationError("Fayl hajmi 10 MB dan oshmasligi kerak.")
            name = value.name.lower()
            if not (name.endswith('.pdf') or name.endswith('.docx') or name.endswith('.doc')):
                raise serializers.ValidationError("Faqat PDF, DOC yoki DOCX fayllar qabul qilinadi.")
        return value


class ApplicationSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    program_flag = serializers.CharField(source='program.flag_emoji', read_only=True)
    program_deadline = serializers.DateField(source='program.deadline', read_only=True)
    required_documents = serializers.JSONField(source='program.required_documents', read_only=True)

    class Meta:
        model = Application
        fields = (
            'id', 'user', 'program', 'program_name', 'program_flag',
            'program_deadline', 'required_documents',
            'status', 'match_score', 'documents', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'match_score', 'created_at', 'updated_at')


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('program',)
