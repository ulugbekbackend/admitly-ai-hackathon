import time

from google import genai
from google.genai import types
from decouple import config

GEMINI_MODEL = config('GEMINI_MODEL', default='gemini-2.0-flash')

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=config('GEMINI_API_KEY'))
    return _client


def call_gemini(system_prompt: str, user_message: str, max_retries: int = 2) -> str:
    client = _get_client()

    last_error = None
    for attempt in range(max_retries + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.4,
                    max_output_tokens=4096,
                ),
            )
            return response.text
        except Exception as e:
            last_error = e
            error_str = str(e).lower()
            if ('quota' in error_str or '429' in error_str or 'rate' in error_str) and attempt < max_retries:
                time.sleep(2 ** attempt)
                continue
            if attempt < max_retries:
                continue
            raise

    raise last_error
