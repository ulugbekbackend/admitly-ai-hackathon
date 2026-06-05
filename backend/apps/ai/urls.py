from django.urls import path
from .views import AnalyzeEssayView, MyEssaysView, ScoreApplicationView

urlpatterns = [
    path('analyze-essay/', AnalyzeEssayView.as_view(), name='analyze-essay'),
    path('score-application/', ScoreApplicationView.as_view(), name='score-application'),
    path('my-essays/', MyEssaysView.as_view(), name='my-essays'),
]
