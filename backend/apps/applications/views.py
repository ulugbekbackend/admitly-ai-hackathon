from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsOwner
from .models import Application, Document
from .serializers import ApplicationSerializer, ApplicationCreateSerializer, DocumentSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).select_related('program')

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer

    def create(self, request, *args, **kwargs):
        create_serializer = ApplicationCreateSerializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        application = create_serializer.save(user=request.user)
        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED,
        )

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsOwner()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get', 'post'], url_path='documents',
            parser_classes=[MultiPartParser, FormParser, JSONParser])
    def documents(self, request, pk=None):
        application = self.get_object()
        if request.method == 'GET':
            docs = application.documents.all()
            return Response(DocumentSerializer(docs, many=True).data)
        serializer = DocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(application=application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DocumentViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Document.objects.filter(application__user=self.request.user)

    def partial_update(self, request, pk=None):
        doc = self.get_object()
        serializer = DocumentSerializer(
            doc, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
