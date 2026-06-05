from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.applications.models import Application
from .services.essay_analyzer import analyze_essay
from .services.document_scorer import calculate_match_score
from .models import EssayAnalysis
from .serializers import EssayAnalysisSerializer

ESSAY_CREDIT_COST = 1


def _gemini_error_response(e):
    """Classify google.genai errors into user-friendly responses."""
    try:
        from google.genai import errors as genai_errors
        if isinstance(e, genai_errors.ClientError):
            code = getattr(e, 'code', None)
            if code == 429:
                return Response(
                    {'error': True, 'detail': "AI xizmati hozir band (rate limit). Iltimos, bir daqiqadan so'ng qayta urinib ko'ring."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            if code in (400, 401, 403):
                return Response(
                    {'error': True, 'detail': f"Gemini API kalit xatosi ({code}). .env faylida GEMINI_API_KEY ni tekshiring. Xato: {str(e)[:120]}"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
    except ImportError:
        pass

    err_str = str(e).lower()
    if 'quota' in err_str or '429' in err_str or 'resource_exhausted' in err_str:
        return Response(
            {'error': True, 'detail': "AI xizmati hozir band. Iltimos, bir daqiqadan so'ng qayta urinib ko'ring."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )
    if any(k in err_str for k in ('api_key', 'invalid', '401', '403', 'permission', 'unauthenticated', 'key not valid')):
        return Response(
            {'error': True, 'detail': f"Gemini API kalit xatosi. .env faylida GEMINI_API_KEY ni tekshiring. Xato: {str(e)[:120]}"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    if 'connection' in err_str or 'network' in err_str or 'timeout' in err_str:
        return Response(
            {'error': True, 'detail': "AI xizmatiga ulanib bo'lmadi. Internet aloqangizni tekshiring."},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    return Response(
        {'error': True, 'detail': f"Tahlil qilishda xatolik: {str(e)[:200]}"},
        status=status.HTTP_502_BAD_GATEWAY,
    )


@method_decorator(ratelimit(key='user', rate='30/d', method='POST', block=True), name='post')
class AnalyzeEssayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        application_id = request.data.get('application_id')
        essay_text = request.data.get('essay_text', '').strip()

        if not application_id:
            return Response(
                {'error': True, 'detail': 'application_id maydoni talab qilinadi.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(essay_text) < 50:
            return Response(
                {'error': True, 'detail': "Esse matni kamida 50 ta belgidan iborat bo'lishi kerak."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if user.credits < ESSAY_CREDIT_COST:
            return Response(
                {
                    'error': True,
                    'detail': "Kredit yetarli emas. Premium tarifga o'ting yoki kredit sotib oling.",
                    'code': 'insufficient_credits',
                    'credits_remaining': user.credits,
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        try:
            application = Application.objects.get(pk=application_id, user=user)
        except Application.DoesNotExist:
            return Response(
                {'error': True, 'detail': 'Ariza topilmadi.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            analysis = analyze_essay(application, essay_text)
        except Exception as e:
            return _gemini_error_response(e)

        user.deduct_credit()

        data = EssayAnalysisSerializer(analysis).data
        data['credits_remaining'] = user.credits
        return Response(data, status=status.HTTP_201_CREATED)


class MyEssaysView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = EssayAnalysis.objects.filter(
            application__user=request.user
        ).select_related('application__program').order_by('-created_at')
        from .serializers import EssayAnalysisListSerializer
        return Response(EssayAnalysisListSerializer(analyses, many=True).data)


class ScoreApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        application_id = request.data.get('application_id')
        if not application_id:
            return Response(
                {'error': True, 'detail': 'application_id maydoni talab qilinadi.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            application = Application.objects.get(pk=application_id, user=request.user)
        except Application.DoesNotExist:
            return Response({'error': True, 'detail': 'Ariza topilmadi.'}, status=status.HTTP_404_NOT_FOUND)

        result = calculate_match_score(application)
        application.match_score = result['score']
        application.save(update_fields=['match_score'])

        return Response({
            'application_id': application.pk,
            'match_score': result['score'],
            'breakdown': result['breakdown'],
        })
