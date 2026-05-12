import uuid
import json
import asyncio
from datetime import datetime

from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.services.mock_data import CHAT_MESSAGES, SESSIONS, CONTENT_MODULES


MOCK_RESPONSES = {
    "coaching": "Based on Chris Peterson's data, here are some coaching recommendations:\n\n1. **Protect Deep Work Time**: Chris has only 4 hrs/week of deep work vs. the 12 hr peer median. Consider blocking 2-3 mornings per week as focus time.\n\n2. **Delegate Ad-hoc Sessions**: The 5 hrs/week spent on urgent ad-hoc meetings with low strategic alignment could be delegated to team leads.\n\n3. **Continue Strategic Involvement**: Chris's Q4 Planning sessions show the highest intent-to-alignment ratio — this is a strength to preserve.",
    "performance": "Here's a performance review snapshot for Chris Peterson:\n\n**Strengths**: Strong strategic alignment in Q4 Planning. Consistent 1-on-1 schedule with all 8 direct reports.\n\n**Areas for Growth**: Meeting load 67% above peer median. Deep Work time significantly below peers.\n\n**Recommendation**: Chris would benefit from meeting audit and delegation support to reclaim focus time.",
    "workload": "Workload analysis for Chris Peterson:\n\n**Current Capacity**: Operating at ~130% of sustainable capacity based on meeting load.\n\n**Burnout Signals**: Deep Work at 4 hrs/week (33% of peer median). High volume of reactive meetings.\n\n**Risk Level**: Moderate-High. Without intervention, risk of disengagement increases.",
    "investigation": "Deep-dive investigation findings:\n\n**Pattern**: Chris's ad-hoc meetings spike on Mondays and Fridays, suggesting end-of-week fire drills and Monday triage.\n\n**Root Cause Hypothesis**: Lack of async communication norms in the Engineering team.\n\n**Historical Trend**: Meeting hours have increased 40% over the past 2 quarters.",
}

APPLY_RESPONSES = {
    "default": "I've updated the report with the new section. The changes have been applied to your document.",
}


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

            mode = request.mode or "coaching"
            response_text = MOCK_RESPONSES.get(mode, MOCK_RESPONSES["coaching"])

            # Stream the response word by word
            words = response_text.split(" ")
            for i, word in enumerate(words):
                chunk = word if i == 0 else f" {word}"
                data = json.dumps({"type": "text", "content": chunk})
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.03)

            # Save the full response
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
        from app.services.mock_data import CONTENT_MODULES, DEFAULT_MODULES

        if session_id in CONTENT_MODULES and CONTENT_MODULES[session_id]:
            # Session already has content, send it
            for module in CONTENT_MODULES[session_id]:
                data = json.dumps({"type": "module", "module": module})
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.5)
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        else:
            # Use default modules from mock_data
            if session_id not in CONTENT_MODULES:
                CONTENT_MODULES[session_id] = []

            for module in DEFAULT_MODULES:
                CONTENT_MODULES[session_id].append(module)
                data = json.dumps({"type": "module", "module": module})
                yield f"data: {data}\n\n"
                await asyncio.sleep(0.5)

            # Update session mode
            for s in SESSIONS:
                if s["id"] == session_id:
                    s["mode"] = mode
                    break

            yield f"data: {json.dumps({'type': 'done'})}\n\n"
