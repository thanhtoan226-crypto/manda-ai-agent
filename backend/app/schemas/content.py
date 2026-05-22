from pydantic import BaseModel


class MetricItem(BaseModel):
    label: str
    value: str
    median: str
    position: str  # "above", "below", "at"


class ChipInfoLLM(BaseModel):
    id: str
    label: str


class LLMContentModule(BaseModel):
    """Structured output schema for LLM-generated content modules."""

    id: str
    title: str
    chips: list[ChipInfoLLM]
    content: dict  # Keys are chip IDs, values vary by chip type:
    #   - Data Interpreter: {"metrics": [...], "text": "..."}
    #   - Insight chips: {"items": ["..."]}
    #   - Table chips: {"table": [...], "headers": [...]}
    #   - Mixed: {"items": [...], "text": "..."}
