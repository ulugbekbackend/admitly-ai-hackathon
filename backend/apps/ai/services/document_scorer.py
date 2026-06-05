"""
Match score calculation based on 5 criteria:
  GPA match          20%
  Language (IELTS)   20%
  Experience         20%
  Essay quality      25%  (applied separately in essay_analyzer)
  Recommendation     15%  (binary: has any documents uploaded?)
"""


def _gpa_score(user_gpa, program_min_gpa) -> int:
    if user_gpa is None or program_min_gpa is None:
        return 0
    ratio = float(user_gpa) / float(program_min_gpa)
    if ratio >= 1.2:
        return 100
    if ratio >= 1.0:
        return 80
    if ratio >= 0.9:
        return 50
    return 20


def _ielts_score(user_ielts, program_min_ielts) -> int:
    if user_ielts is None or program_min_ielts is None:
        return 0
    ratio = float(user_ielts) / float(program_min_ielts)
    if ratio >= 1.1:
        return 100
    if ratio >= 1.0:
        return 80
    if ratio >= 0.9:
        return 50
    return 20


def _experience_score(experience_years: int) -> int:
    if experience_years >= 5:
        return 100
    if experience_years >= 3:
        return 80
    if experience_years >= 1:
        return 60
    return 30


def _recommendation_score(documents) -> int:
    rec_docs = [d for d in documents if 'recommendation' in d.doc_type.lower()]
    if len(rec_docs) >= 2:
        return 100
    if len(rec_docs) == 1:
        return 60
    return 0


def calculate_match_score(application) -> dict:
    user = application.user
    program = application.program
    documents = list(application.documents.all())

    gpa = _gpa_score(user.gpa, program.min_gpa)
    ielts = _ielts_score(user.ielts_score, program.min_ielts)
    experience = _experience_score(user.experience_years)
    recommendation = _recommendation_score(documents)

    # Essay score is taken from the latest EssayAnalysis if available
    essay_analyses = application.essay_analyses.order_by('-created_at')
    essay = int(essay_analyses.first().overall_score) if essay_analyses.exists() else 0

    breakdown = {
        'gpa': gpa,
        'language': ielts,
        'experience': experience,
        'essay': essay,
        'recommendation': recommendation,
    }

    total = (
        gpa * 0.20
        + ielts * 0.20
        + experience * 0.20
        + essay * 0.25
        + recommendation * 0.15
    )

    return {'score': round(total), 'breakdown': breakdown}
