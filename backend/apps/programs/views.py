from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Program
from .serializers import ProgramSerializer, ProgramListSerializer


class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProgramListSerializer
        return ProgramSerializer

    @action(detail=True, methods=['get'], url_path='checklist')
    def checklist(self, request, pk=None):
        program = self.get_object()
        return Response({'required_documents': program.required_documents})
