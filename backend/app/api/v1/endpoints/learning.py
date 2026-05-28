from fastapi import APIRouter, HTTPException

from app.schemas.learning import (
    LearningModuleListResponse,
    LearningModule,
    TopicContent,
    TopicProgressUpdate,
    TopicMeta,
    LearningProgressSummary,
)
from app.services.learning_service import LearningService

router = APIRouter(tags=["learning"])


@router.get("/modules", response_model=LearningModuleListResponse)
async def list_modules():
    service = LearningService()
    return await service.list_modules()


@router.get("/modules/{module_id}", response_model=LearningModule)
async def get_module(module_id: str):
    service = LearningService()
    result = await service.get_module(module_id)
    if not result:
        raise HTTPException(status_code=404, detail="Module not found")
    return result


@router.get("/modules/{module_id}/topics/{topic_id}", response_model=TopicContent)
async def get_topic_content(module_id: str, topic_id: str):
    service = LearningService()
    result = await service.get_topic_content(module_id, topic_id)
    if not result:
        raise HTTPException(status_code=404, detail="Topic not found")
    return result


@router.put("/modules/{module_id}/topics/{topic_id}/progress", response_model=TopicMeta)
async def update_progress(module_id: str, topic_id: str, body: TopicProgressUpdate):
    service = LearningService()
    result = await service.update_progress(topic_id, body.completed)
    if not result:
        raise HTTPException(status_code=404, detail="Topic not found")
    return result


@router.get("/progress", response_model=LearningProgressSummary)
async def get_progress_summary():
    service = LearningService()
    return await service.get_progress_summary()
