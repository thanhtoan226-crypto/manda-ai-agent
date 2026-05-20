from pathlib import Path

from pydantic_settings import BaseSettings

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "Manda AI Agent"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # LLM (Z.AI / OpenAI-compatible)
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://api.z.ai/api/paas/v4/"
    LLM_MODEL: str = "glm-5.1"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./manda.db"

    # Redis (for conversation memory)
    REDIS_URL: str = "redis://localhost:6379/0"

    model_config = {"env_file": str(ROOT_DIR / ".env"), "extra": "ignore"}


settings = Settings()
