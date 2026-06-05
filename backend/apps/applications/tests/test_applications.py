from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.programs.models import Program
from apps.applications.models import Application

User = get_user_model()


class ApplicationViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com', full_name='User', password='Str0ngPass!'
        )
        self.other_user = User.objects.create_user(
            email='other@example.com', full_name='Other', password='Str0ngPass!'
        )
        self.program = Program.objects.create(
            name='Test Program', type='grant', country='USA',
            flag_emoji='🇺🇸', required_documents=['CV'],
        )

    def test_create_application_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('application-list'), {'program': self.program.pk})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_application_unauthenticated(self):
        response = self.client.post(reverse('application-list'), {'program': self.program.pk})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_own_applications_only(self):
        Application.objects.create(user=self.user, program=self.program)
        Application.objects.create(user=self.other_user, program=self.program)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)

    def test_application_list_unauthenticated(self):
        response = self.client.get(reverse('application-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
