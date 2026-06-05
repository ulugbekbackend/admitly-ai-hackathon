from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

PLAN_FREE = 'free'
PLAN_PREMIUM = 'premium'

PLAN_CHOICES = [
    (PLAN_FREE, 'Free'),
    (PLAN_PREMIUM, 'Premium'),
]

FREE_CREDITS = 5
PREMIUM_CREDITS = 100


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        extra_fields.setdefault('credits', FREE_CREDITS)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('plan', PLAN_PREMIUM)
        extra_fields.setdefault('credits', 9999)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    ielts_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    experience_years = models.PositiveSmallIntegerField(default=0)

    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default=PLAN_FREE)
    credits = models.IntegerField(default=FREE_CREDITS)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    @property
    def is_premium(self):
        return self.plan == PLAN_PREMIUM

    def deduct_credit(self):
        if self.credits <= 0:
            raise ValueError('Kredit yetarli emas')
        self.credits -= 1
        self.save(update_fields=['credits'])

    def upgrade_to_premium(self):
        self.plan = PLAN_PREMIUM
        self.credits = PREMIUM_CREDITS
        self.save(update_fields=['plan', 'credits'])

    def __str__(self):
        return f"{self.email} ({self.plan})"
