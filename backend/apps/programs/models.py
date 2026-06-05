from django.db import models


class Program(models.Model):
    TYPE_CHOICES = [('university', 'University'), ('grant', 'Grant')]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    country = models.CharField(max_length=100)
    flag_emoji = models.CharField(max_length=10)
    deadline = models.DateField(null=True, blank=True)
    required_documents = models.JSONField(default=list)
    min_gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    min_ielts = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.flag_emoji} {self.name}"

    class Meta:
        ordering = ['name']
