from fastapi import APIRouter, HTTPException

from app.schemas.agent import AgentListResponse, AgentDetailResponse
from app.services.agent_service import AgentService

router = APIRouter()


@router.get("/", response_model=AgentListResponse)
async def list_agents():
    service = AgentService()
    return await service.list_agents()


@router.get("/{agent_id}", response_model=AgentDetailResponse)
async def get_agent(agent_id: str):
    service = AgentService()
    result = await service.get_agent(agent_id)
    if not result:
        raise HTTPException(status_code=404, detail="Agent not found")
    return result


@router.put("/{agent_id}/favorite")
async def toggle_favorite(agent_id: str):
    service = AgentService()
    result = await service.toggle_favorite(agent_id)
    if not result:
        raise HTTPException(status_code=404, detail="Agent not found")
    return result
