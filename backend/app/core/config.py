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

    # LLM (OpenRouter / OpenAI-compatible)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "moonshotai/kimi-k2.6:free"
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://openrouter.ai/api/v1"
    LLM_MODEL: str = "moonshotai/kimi-k2.6:free"
    LLM_TIMEOUT: int = 60
    LLM_MAX_TOKENS: int = 4096

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./manda.db"

    # Learning content
    LEARNING_DATA_DIR: str = str(ROOT_DIR / "backend" / "data" / "learning")

    # Pulse reports
    REPORTS_DATA_DIR: str = str(ROOT_DIR / "backend" / "data" / "reports")

    # Redis (for conversation memory)
    REDIS_URL: str = "redis://localhost:6379/0"

    model_config = {"env_file": str(ROOT_DIR / ".env"), "extra": "ignore"}


settings = Settings()
