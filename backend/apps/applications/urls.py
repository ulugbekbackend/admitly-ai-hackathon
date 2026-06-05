from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, DocumentViewSet

router = DefaultRouter()
router.register(r'', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
    path('documents/<int:pk>/', DocumentViewSet.as_view({'patch': 'partial_update'}), name='document-detail'),
]
