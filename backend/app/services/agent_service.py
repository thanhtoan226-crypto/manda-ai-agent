from typing import Optional
from app.schemas.agent import AgentInfo, AgentListResponse, AgentDetailResponse, ConversationMode
from app.services.mock_data import AGENTS, AGENT_MODES


class AgentService:
    async def list_agents(self) -> AgentListResponse:
        return AgentListResponse(
            agents=[AgentInfo(**a) for a in AGENTS]
        )

    async def get_agent(self, agent_id: str) -> Optional[AgentDetailResponse]:
        agent = next((a for a in AGENTS if a["id"] == agent_id), None)
        if not agent:
            return None
        return AgentDetailResponse(
            agent=AgentInfo(**agent),
            modes=[ConversationMode(**m) for m in AGENT_MODES.get(agent_id, [])],
        )

    async def toggle_favorite(self, agent_id: str) -> Optional[AgentDetailResponse]:
        agent = next((a for a in AGENTS if a["id"] == agent_id), None)
        if not agent:
            return None
        agent["is_favorite"] = not agent["is_favorite"]
        return AgentDetailResponse(
            agent=AgentInfo(**agent),
            modes=[ConversationMode(**m) for m in AGENT_MODES.get(agent_id, [])],
        )
