from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Manda AI Agent"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # LLM
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./manda.db"

    # Redis (for conversation memory)
    REDIS_URL: str = "redis://localhost:6379/0"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
