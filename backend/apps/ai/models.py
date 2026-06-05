from django.db import models


class EssayAnalysis(models.Model):
    application = models.ForeignKey(
        'applications.Application',
        on_delete=models.CASCADE,
        related_name='essay_analyses',
    )
    overall_score = models.PositiveSmallIntegerField(default=0)
    match_level = models.CharField(
        max_length=10,
        choices=[('strong', 'Strong'), ('medium', 'Medium'), ('weak', 'Weak')],
    )
    summary_uz = models.TextField(blank=True)
    word_count = models.PositiveIntegerField(default=0)
    essay_text = models.TextField(blank=True)
    annotations = models.JSONField(default=list)
    missing_uz = models.JSONField(default=list)
    strengths_uz = models.JSONField(default=list)
    breakdown = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Essay Analysis #{self.pk} — score {self.overall_score}"
