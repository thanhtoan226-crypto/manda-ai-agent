from langchain_openai import ChatOpenAI

from app.core.config import settings

_llm: ChatOpenAI | None = None
_llm_streaming: ChatOpenAI | None = None


def get_llm() -> ChatOpenAI | None:
    """Return singleton LLM client (non-streaming). Returns None if API key is not set."""
    if not settings.LLM_API_KEY:
        return None
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(
            api_key=settings.LLM_API_KEY,
            base_url=settings.LLM_BASE_URL,
            model=settings.LLM_MODEL,
            streaming=False,
            request_timeout=settings.LLM_TIMEOUT,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
    return _llm


def get_llm_streaming() -> ChatOpenAI | None:
    """Return singleton LLM client (streaming). Returns None if API key is not set."""
    if not settings.LLM_API_KEY:
        return None
    global _llm_streaming
    if _llm_streaming is None:
        _llm_streaming = ChatOpenAI(
            api_key=settings.LLM_API_KEY,
            base_url=settings.LLM_BASE_URL,
            model=settings.LLM_MODEL,
            streaming=True,
            request_timeout=settings.LLM_TIMEOUT,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
    return _llm_streaming


def is_llm_configured() -> bool:
    return bool(settings.LLM_API_KEY)
