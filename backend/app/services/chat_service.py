import uuid
import json
import asyncio
from datetime import datetime

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from app.core.llm import get_llm, get_llm_streaming, is_llm_configured
from app.agents.prompts import get_prompt, get_module_specs
from app.agents.context import build_context
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.schemas.content import LLMContentModule
from app.services.mock_data import CHAT_MESSAGES, SESSIONS, CONTENT_MODULES, AGENT_MODULES


MOCK_RESPONSES = {
    "coaching": "Based on the meeting data, here are some coaching recommendations:\n\n1. **Acknowledge Response Rate**: The 99.2% response rate is exceptional and shows strong calendar discipline. This is worth recognizing and protecting.\n\n2. **Protect Boundaries**: Minimal outside-hours meetings (0.5 hrs) indicates healthy work-life boundaries. This is a strength to maintain.\n\n3. **Build on Speedy Adoption**: The 37.3% speedy meeting adoption is above peers — consider extending this practice to recurring meetings as well.",
    "performance": "Here's a performance snapshot based on the meeting data:\n\n**Strengths**: Top-quartile response rate (99.2% vs 80.2% peer median). Strong speedy meeting adoption (37.3% vs 22.7%). Good recurring/ad-hoc balance.\n\n**Areas for Growth**: Meeting load spiked in March (79.4 hrs, 49% of time). Wednesday clustering creates marathon meeting days. External engagement at 23.7% is above typical for this role level.\n\n**Recommendation**: Focus on redistributing Wednesday load and evaluating whether all large alignment forums require weekly attendance.",
    "workload": "Workload analysis based on meeting patterns:\n\n**Current Load**: 62.5 hrs/month in meetings (38.5% of working time). March peaked at 79.4 hrs before settling.\n\n**Calendar Density**: Wednesday is the heaviest day at 18.3 hrs/month (29% of weekly meeting time). Most meetings cluster 10am-3pm.\n\n**Capacity Indicators**: After-hours meetings are minimal (0.5 hrs). The March spike was project-driven and has recovered. Current level appears sustainable but near the upper threshold.",
    "investigation": "Investigation findings based on meeting data:\n\n**Response Rate**: 99.2% — exceptional, well above peer median of 80.2%.\n**Meeting Organization**: 39% of meetings are self-organized. Quality score of organized meetings: 65.2%.\n**Attendance Patterns**: 0% cancellation rate on 1:1s. 75% reschedule rate (meetings happen but move).\n**External Engagement**: 23.7% of meeting time is external across 16 companies — above typical for this role.\n**Large Meetings**: 37.3% of meetings have 8+ attendees, above the 28.3% peer median.",
    "talent": "People-centric signals from the meeting data:\n\n**Engagement**: Response rate of 99.2% indicates strong engagement with calendar discipline. 1-on-1 coverage gap exists in some teams — approximately 18 managers have inconsistent cadences.\n\n**Burnout Risk**: After-hours meetings are minimal at 0.5 hrs. However, the March spike (79.4 hrs, 49% of time) is a cautionary signal about project-driven overload.\n\n**1-on-1 Coverage**: Department-wide coverage at 74.6% is below the 82.1% org median. This is a retention risk that should be addressed.",
    "board-ready": "Executive summary for leadership:\n\n**Key Metrics**: Meeting cost $2.85M, avg 18.4 hrs/employee, growth +5.1% MoM. Quality score 67.4%, agenda usage 58.2%.\n\n**Trend Direction**: Meeting costs rising above benchmark. At current growth rate, the department will exceed the 20-hour burnout threshold by Q3.\n\n**Cost Impact**: Cross-team alignment meetings account for 41% of meeting cost. Platform team is the highest cost center at $890K.\n\n**Action Required**: Address 1-on-1 coverage gap (74.6% vs 82.1% median) and audit large recurring meetings.",
    "capacity": "Capacity review based on workload distribution:\n\n**Department Average**: 18.4 meeting hrs/employee vs 16.2 org median. 28.4% of meetings are large (8+ attendees).\n\n**Overloaded Teams**: Platform (22.1 hrs/employee) and DevOps (21.6 hrs/employee) are above the burnout threshold.\n\n**Resource Utilization**: After-hours meetings concentrated in DevOps (3x org average). On-call overlap with standups is the primary driver.\n\n**Recommendation**: Implement async standup format for on-call rotation. Redistribute cross-team syncs to reduce Platform team load.",
    "risk": "Risk assessment based on meeting analytics:\n\n**Declining Quality**: Platform team quality score at 61.2%, declining 3.8 points over the quarter. Correlates with 12% increase in large meetings.\n\n**Attendance Drops**: 3 recurring meetings show declining attendance (-12% to -18% over 3 months). All lack agendas.\n\n**1-on-1 Coverage Gap**: 74.6% coverage means ~18 managers have inconsistent cadences. Teams with low 1-on-1 coverage show 2x skip-level escalation rates.\n\n**Action Required**: Flag 3 managers with lowest 1-on-1 cadence for immediate follow-up. Consolidate 4 large alignment meetings.",
    "cost": "Cost optimization analysis for recurring meetings:\n\n**Current Spend**: $9,780/month on 14 recurring meetings totaling 42.5 hrs. 61.2% of calendar is recurring (above 52% benchmark).\n\n**Highest Cost Items**: Weekly Sprint Sync ($7,360/mo), 1-on-1s ($2,880/mo), Tech Debt Review ($3,200/mo).\n\n**Quick Wins**: 3 meetings can be shortened (save $1,380/mo). 2 weekly meetings can move to bi-weekly (save $920/mo). 1 meeting is an elimination candidate ($4,800/mo).\n\n**Total Potential Savings**: $6,720/month and 14 hrs/month if all recommendations are implemented.",
    "quality": "Quality review of recurring meetings:\n\n**Average Quality Score**: 54.8% — 7.3 points below the peer median of 62.1%. Agenda usage at 42.1% vs 58.3% median.\n\n**Best Performers**: Sprint Planning (78% quality), Team Retrospective (74%), 1-on-1s (82%). All have consistent agendas and clear desired outcomes.\n\n**Worst Performers**: 'Catch-up' (28% quality, 0% agenda), 'Status update' (31% quality, no outcomes). Both show declining attendance.\n\n**Recommendation**: Add agendas to all meetings. Tag desired outcomes for the 4 meetings currently without them. Consolidate overlapping sessions.",
    "attendance": "Attendance and engagement analysis:\n\n**Response Rate**: 72.4% average — 9.2 points below the 81.6% peer median.\n\n**Declining Trends**: 3 meetings show consistent attendance decline over the past 3 months: 'Catch-up' (-18%), 'Status update' (-15%), 'Vendor sync' (-12%).\n\n**No-Response Patterns**: 'Catch-up' has 35% no-response rate. 'Status update' at 42%. Both lack agendas and clear purpose.\n\n**Positive Signals**: Sprint Planning maintains 92% attendance. 1-on-1s have 0% cancellation rate. Team Retrospective at 88%.\n\n**Recommendation**: Replace declining meetings with async updates. Add response tracking for meetings below 60% response rate.",
}

APPLY_RESPONSES = {
    "default": "I've updated the report with the new section. The changes have been applied to your document.",
}

_HISTORY_LIMIT = 10


class ChatService:
    async def process_message(self, request: ChatRequest) -> ChatResponse:
        conversation_id = request.conversation_id or str(uuid.uuid4())
        session_id = request.session_id

        if session_id and session_id in CHAT_MESSAGES:
            msg_id = f"msg-{uuid.uuid4().hex[:8]}"
            user_msg = {
                "id": msg_id,
                "role": "user",
                "content": request.message,
                "timestamp": datetime.now().isoformat(),
            }
            CHAT_MESSAGES[session_id].append(user_msg)

            if is_llm_configured():
                response_text = await self._llm_invoke(request)
            else:
                mode = request.mode or "coaching"
                response_text = MOCK_RESPONSES.get(mode, MOCK_RESPONSES["coaching"])

            assistant_msg = {
                "id": f"msg-{uuid.uuid4().hex[:8]}",
                "role": "assistant",
                "content": response_text,
                "timestamp": datetime.now().isoformat(),
            }
            CHAT_MESSAGES[session_id].append(assistant_msg)

            return ChatResponse(
                message=ChatMessage(**assistant_msg),
                conversation_id=conversation_id,
            )

        return ChatResponse(
            message=ChatMessage(role="assistant", content="Hello! I'm Manda."),
            conversation_id=conversation_id,
        )

    async def stream_message(self, request: ChatRequest):
        conversation_id = request.conversation_id or str(uuid.uuid4())
        session_id = request.session_id

        if session_id and session_id in CHAT_MESSAGES:
            msg_id = f"msg-{uuid.uuid4().hex[:8]}"
            user_msg = {
                "id": msg_id,
                "role": "user",
                "content": request.message,
                "timestamp": datetime.now().isoformat(),
            }
            CHAT_MESSAGES[session_id].append(user_msg)

            if is_llm_configured():
                full_response = ""
                async for chunk in self._llm_stream(request):
                    full_response += chunk
                    data = json.dumps({"type": "text", "content": chunk})
                    yield f"data: {data}\n\n"

                assistant_msg = {
                    "id": f"msg-{uuid.uuid4().hex[:8]}",
                    "role": "assistant",
                    "content": full_response,
                    "timestamp": datetime.now().isoformat(),
                }
                CHAT_MESSAGES[session_id].append(assistant_msg)
            else:
                mode = request.mode or "coaching"
                response_text = MOCK_RESPONSES.get(mode, MOCK_RESPONSES["coaching"])

                words = response_text.split(" ")
                for i, word in enumerate(words):
                    chunk = word if i == 0 else f" {word}"
                    data = json.dumps({"type": "text", "content": chunk})
                    yield f"data: {data}\n\n"
                    await asyncio.sleep(0.03)

                assistant_msg = {
                    "id": f"msg-{uuid.uuid4().hex[:8]}",
                    "role": "assistant",
                    "content": response_text,
                    "timestamp": datetime.now().isoformat(),
                }
                CHAT_MESSAGES[session_id].append(assistant_msg)

            done_data = json.dumps({"type": "done", "conversation_id": conversation_id})
            yield f"data: {done_data}\n\n"
        else:
            greeting = json.dumps({"type": "text", "content": "Hello! I'm Manda."})
            done = json.dumps({"type": "done", "conversation_id": conversation_id})
            yield f"data: {greeting}\n\n"
            yield f"data: {done}\n\n"

    async def stream_initial_content(self, session_id: str, mode: str):
        """Stream initial content modules when a mode is selected."""
        if session_id in CONTENT_MODULES and CONTENT_MODULES[session_id]:
            for module in CONTENT_MODULES[session_id]:
                data = json.dumps({"type": "module", "module": module})
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.5)
            for s in SESSIONS:
                if s["id"] == session_id:
                    s["mode"] = mode
                    break
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return

        session = next((s for s in SESSIONS if s["id"] == session_id), None)
        agent_id = session["agent_id"] if session else "agent-1on1"

        if session_id not in CONTENT_MODULES:
            CONTENT_MODULES[session_id] = []

        if is_llm_configured():
            async for event in self._llm_generate_modules(session_id, agent_id, mode):
                yield event
        else:
            modules_to_use = AGENT_MODULES.get(agent_id, AGENT_MODULES["agent-1on1"])
            for module in modules_to_use:
                CONTENT_MODULES[session_id].append(module)
                data = json.dumps({"type": "module", "module": module})
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.5)

        for s in SESSIONS:
            if s["id"] == session_id:
                s["mode"] = mode
                break

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    # --- LLM helpers ---

    def _build_messages(self, request: ChatRequest) -> list:
        """Build LangChain message list from request context and conversation history."""
        agent_id = request.agent_id or "agent-1on1"
        mode = request.mode or "coaching"
        prompt_config = get_prompt(agent_id, mode)
        context = build_context(agent_id, None, mode)

        messages = [SystemMessage(content=f"{prompt_config.system_prompt}\n\n{context}")]

        session_id = request.session_id
        if session_id and session_id in CHAT_MESSAGES:
            history = CHAT_MESSAGES[session_id][-_HISTORY_LIMIT:]
            for msg in history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=request.message))
        return messages

    async def _llm_invoke(self, request: ChatRequest) -> str:
        """Non-streaming LLM call."""
        llm = get_llm()
        if not llm:
            mode = request.mode or "coaching"
            return MOCK_RESPONSES.get(mode, MOCK_RESPONSES["coaching"])
        messages = self._build_messages(request)
        result = await llm.ainvoke(messages)
        return result.content

    async def _llm_stream(self, request: ChatRequest):
        """Streaming LLM call — yields text chunks."""
        llm = get_llm_streaming()
        if not llm:
            mode = request.mode or "coaching"
            text = MOCK_RESPONSES.get(mode, MOCK_RESPONSES["coaching"])
            for word in text.split(" "):
                yield word if text.index(word) == 0 else f" {word}"
            return

        messages = self._build_messages(request)
        async for chunk in llm.astream(messages):
            if chunk.content:
                yield chunk.content

    async def _llm_generate_modules(self, session_id: str, agent_id: str, mode: str):
        """Generate content modules via LLM with structured output. Yields SSE events."""
        llm = get_llm()
        if not llm:
            return

        prompt_config = get_prompt(agent_id, mode)
        context = build_context(agent_id, None, mode)
        module_specs = get_module_specs(agent_id)

        for spec in module_specs:
            chip_descriptions = ", ".join(f'"{c.label}" (id: {c.id})' for c in spec.chips)

            content_prompt = f"""{prompt_config.system_prompt}

{context}

Generate a content module titled "{spec.title}" with these chip sections: {chip_descriptions}.

{prompt_config.content_instructions}

The module must have:
- id: "{spec.id}"
- title: "{spec.title}"
- chips: a list of objects with id and label matching the chip sections above
- content: a dict keyed by chip id where:
  - Data Interpreter chips contain: {{"metrics": [{{"label": str, "value": str, "median": str, "position": "above"|"below"|"at"}}], "text": str}}
  - Insight chips contain: {{"items": [str]}}
  - Table chips contain: {{"headers": [{{"key": str, "label": str}}], "table": [dict]}}
  - Mixed chips contain: {{"items": [str], "text": str}}

Respond with a single JSON object matching this schema."""

            try:
                structured_llm = llm.with_structured_output(LLMContentModule)
                messages = [
                    SystemMessage(content=content_prompt),
                    HumanMessage(
                        content=f'Generate the "{spec.title}" module in {prompt_config.tone} tone for {mode} mode.'
                    ),
                ]
                result = await structured_llm.ainvoke(messages)
                module_dict = result.model_dump()
                module_dict.setdefault("id", spec.id)
                module_dict.setdefault("title", spec.title)

                # Ensure chips have enabled field
                for chip in module_dict.get("chips", []):
                    chip.setdefault("enabled", chip.get("id", "").endswith("-data") or chip.get("id") == "chip-data")

                CONTENT_MODULES[session_id].append(module_dict)
                data = json.dumps({"type": "module", "module": module_dict})
                yield f"data: {data}\n\n"
            except Exception:
                # Fallback: use mock module for this spec
                mock_modules = AGENT_MODULES.get(agent_id, AGENT_MODULES["agent-1on1"])
                mock_module = next((m for m in mock_modules if m["id"] == spec.id), None)
                if mock_module:
                    CONTENT_MODULES[session_id].append(mock_module)
                    data = json.dumps({"type": "module", "module": mock_module})
                    yield f"data: {data}\n\n"
