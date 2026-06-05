from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, UpgradePlanView, BuyCreditsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('upgrade/', UpgradePlanView.as_view(), name='auth-upgrade'),
    path('buy-credits/', BuyCreditsView.as_view(), name='auth-buy-credits'),
]
