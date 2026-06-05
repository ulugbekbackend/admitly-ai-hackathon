from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterViewTest(APITestCase):
    def test_register_success(self):
        data = {
            'email': 'test@example.com',
            'full_name': 'Test User',
            'password': 'Str0ngPass!',
            'password2': 'Str0ngPass!',
        }
        response = self.client.post(reverse('auth-register'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

    def test_register_password_mismatch(self):
        data = {
            'email': 'test@example.com',
            'full_name': 'Test User',
            'password': 'Str0ngPass!',
            'password2': 'Wrong',
        }
        response = self.client.post(reverse('auth-register'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MeViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='me@example.com',
            full_name='Me User',
            password='Str0ngPass!',
        )

    def test_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('auth-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_me_unauthenticated(self):
        response = self.client.get(reverse('auth-me'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
