from langchain_openai import ChatOpenAI

from app.core.config import settings

_llm: ChatOpenAI | None = None
_llm_streaming: ChatOpenAI | None = None


def _api_key() -> str:
    return settings.OPENROUTER_API_KEY or settings.LLM_API_KEY


def _base_url() -> str:
    if settings.OPENROUTER_API_KEY:
        return "https://openrouter.ai/api/v1"
    return settings.LLM_BASE_URL


def _model() -> str:
    if settings.OPENROUTER_API_KEY and settings.OPENROUTER_MODEL:
        return settings.OPENROUTER_MODEL
    return settings.LLM_MODEL


def get_llm() -> ChatOpenAI | None:
    """Return singleton LLM client (non-streaming). Returns None if API key is not set."""
    key = _api_key()
    if not key:
        return None
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(
            api_key=key,
            base_url=_base_url(),
            model=_model(),
            streaming=False,
            request_timeout=settings.LLM_TIMEOUT,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
    return _llm


def get_llm_streaming() -> ChatOpenAI | None:
    """Return singleton LLM client (streaming). Returns None if API key is not set."""
    key = _api_key()
    if not key:
        return None
    global _llm_streaming
    if _llm_streaming is None:
        _llm_streaming = ChatOpenAI(
            api_key=key,
            base_url=_base_url(),
            model=_model(),
            streaming=True,
            request_timeout=settings.LLM_TIMEOUT,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
    return _llm_streaming


def is_llm_configured() -> bool:
    return bool(_api_key())
