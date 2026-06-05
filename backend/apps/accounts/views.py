from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UpgradePlanView(APIView):
    """
    Demo upgrade endpoint.
    In production this would integrate with a payment provider.
    For now it immediately upgrades the user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_premium:
            return Response(
                {'detail': "Siz allaqachon Premium foydalanuvchisiz."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.upgrade_to_premium()
        return Response({
            'detail': "Premium tarifga muvaffaqiyatli o'tildingiz!",
            'user': UserSerializer(user).data,
        })


class BuyCreditsView(APIView):
    """Demo endpoint — adds 10 credits for free users."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        amount = int(request.data.get('amount', 10))
        if amount not in (10, 20, 50):
            return Response({'detail': "Noto'g'ri kredit miqdori."}, status=status.HTTP_400_BAD_REQUEST)
        user.credits += amount
        user.save(update_fields=['credits'])
        return Response({
            'detail': f"{amount} ta kredit qo'shildi.",
            'credits': user.credits,
        })
