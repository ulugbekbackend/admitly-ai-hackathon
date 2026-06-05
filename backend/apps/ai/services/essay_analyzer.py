import json
from pathlib import Path

from apps.ai.models import EssayAnalysis
from .gemini_client import call_gemini

PROMPT_PATH = Path(__file__).resolve().parent.parent / 'prompts' / 'essay_system.txt'
_system_template = None


def _get_system_prompt(program_name: str) -> str:
    global _system_template
    if _system_template is None:
        _system_template = PROMPT_PATH.read_text(encoding='utf-8')
    return _system_template.replace('{{PROGRAM_NAME}}', program_name)


def _parse_json(raw: str) -> dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        cleaned = raw.strip()
        if cleaned.startswith('```'):
            cleaned = cleaned.split('\n', 1)[1].rsplit('```', 1)[0]
        return json.loads(cleaned)


def analyze_essay(application, essay_text: str) -> EssayAnalysis:
    system_prompt = _get_system_prompt(application.program.name)
    raw = call_gemini(system_prompt, essay_text)
    data = _parse_json(raw)

    analysis = EssayAnalysis.objects.create(
        application=application,
        overall_score=int(data.get('overall_score', 0)),
        match_level=data.get('match_level', 'weak'),
        summary_uz=data.get('summary_uz', ''),
        word_count=int(data.get('word_count', len(essay_text.split()))),
        essay_text=essay_text,
        annotations=data.get('annotations', []),
        missing_uz=data.get('missing_uz', []),
        strengths_uz=data.get('strengths_uz', []),
        breakdown=data.get('breakdown', {}),
    )

    application.match_score = min(100, application.match_score + int(analysis.overall_score * 0.25))
    application.save(update_fields=['match_score'])

    return analysis
