from typing import Optional
from pydantic import BaseModel


class TopicMeta(BaseModel):
    id: str
    title: str
    description: str
    learning_objective: str
    sort_order: int
    estimated_minutes: int
    completed: bool = False


class LearningModule(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    sort_order: int
    topics: list[TopicMeta]
    progress_percent: int = 0


class LearningModuleListResponse(BaseModel):
    modules: list[LearningModule]
    overall_progress_percent: int = 0


class TopicContent(BaseModel):
    topic_id: str
    title: str
    module_id: str
    module_title: str
    markdown: str
    completed: bool = False
    estimated_minutes: int = 5


class TopicProgressUpdate(BaseModel):
    completed: bool


class ModuleProgress(BaseModel):
    module_id: str
    module_title: str
    completed: int
    total: int
    progress_percent: int


class LearningProgressSummary(BaseModel):
    total_topics: int
    completed_topics: int
    overall_percent: int
    modules: list[ModuleProgress]
