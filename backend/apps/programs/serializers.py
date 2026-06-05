from rest_framework import serializers
from .models import Program


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'


class ProgramListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ('id', 'name', 'type', 'country', 'flag_emoji', 'deadline', 'min_gpa', 'min_ielts')
