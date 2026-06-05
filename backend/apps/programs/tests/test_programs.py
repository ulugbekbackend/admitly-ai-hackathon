from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.programs.models import Program


class ProgramViewSetTest(APITestCase):
    def setUp(self):
        Program.objects.create(
            name='Test Program',
            type='grant',
            country='USA',
            flag_emoji='🇺🇸',
            required_documents=['CV', 'Essay'],
        )

    def test_list_programs_public(self):
        response = self.client.get(reverse('program-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_program(self):
        program = Program.objects.first()
        response = self.client.get(reverse('program-detail', args=[program.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_checklist_endpoint(self):
        program = Program.objects.first()
        response = self.client.get(f'/api/programs/{program.pk}/checklist/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('required_documents', response.data)
