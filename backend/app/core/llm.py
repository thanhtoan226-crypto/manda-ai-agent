from langchain_openai import ChatOpenAI

from app.core.config import settings

_llm: ChatOpenAI | None = None
_llm_streaming: ChatOpenAI | None = None


def _api_key() -> str:
    return settings.LLM_API_KEY


def _base_url() -> str:
    return settings.LLM_BASE_URL


def _model() -> str:
    return settings.LLM_MODEL


def _create_llm(streaming: bool = False) -> ChatOpenAI | None:
    key = _api_key()
    if not key:
        return None
    return ChatOpenAI(
        api_key=key,
        base_url=_base_url(),
        model=_model(),
        streaming=streaming,
        request_timeout=settings.LLM_TIMEOUT,
        max_tokens=settings.LLM_MAX_TOKENS,
    )


def get_llm() -> ChatOpenAI | None:
    global _llm
    if _llm is None:
        _llm = _create_llm(streaming=False)
    return _llm


def get_llm_streaming() -> ChatOpenAI | None:
    global _llm_streaming
    if _llm_streaming is None:
        _llm_streaming = _create_llm(streaming=True)
    return _llm_streaming


def is_llm_configured() -> bool:
    return bool(_api_key())
