import anthropic
from decouple import config

_client = None


def get_client():
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=config('ANTHROPIC_API_KEY'))
    return _client


def call_claude(system_prompt: str, user_message: str, max_retries: int = 2) -> str:
    client = get_client()
    last_error = None

    for attempt in range(max_retries + 1):
        try:
            message = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=4096,
                timeout=30,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}],
            )
            return message.content[0].text
        except anthropic.APIStatusError as e:
            last_error = e
            if e.status_code in (429, 529) and attempt < max_retries:
                continue
            raise
        except anthropic.APIConnectionError as e:
            last_error = e
            if attempt < max_retries:
                continue
            raise

    raise last_error
