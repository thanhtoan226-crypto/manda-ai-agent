import uuid
import json
import asyncio
from datetime import datetime

from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.services.mock_data import CHAT_MESSAGES, SESSIONS, CONTENT_MODULES


MOCK_RESPONSES = {
    "coaching": "Based on Sarah Mitchell's data, here are some coaching recommendations:\n\n1. **Capitalize on Pricing Strength**: Sarah's list-to-close ratio of 98.2% is exceptional. This pricing expertise could be shared with junior agents through a mentorship program.\n\n2. **Optimize Listing Mix**: With single-family homes taking 42 days to close vs. 28 for condos, consider advising a strategic mix shift during high-volume periods.\n\n3. **Maintain Client Relationships**: Sarah's 4.8/5 satisfaction score and 34% referral rate are clear competitive advantages — keep investing in client communication.",
    "performance": "Here's a performance review snapshot for Sarah Mitchell:\n\n**Strengths**: Top 5% list-to-close ratio at 98.2%. Listings sell in 18 days vs. 32-day peer median. Lead conversion rate 53% above peer average.\n\n**Areas for Growth**: March conversion dipped to 3.1% during listing spike. Inspection contingency fallout rate higher than peers.\n\n**Recommendation**: Sarah would benefit from pipeline management support during peak seasons to maintain conversion quality at scale.",
    "pipeline": "Pipeline analysis for Sarah Mitchell:\n\n**Current Pipeline**: $2.84M across 34 listings, with 4 deals in escrow.\n\n**Stalled Deals**: 3 deals in negotiation stage for over 14 days. 142 Oak Ridge Dr has a $15K price gap between buyer and seller.\n\n**Risk Level**: Moderate. Without intervention on stalled deals, April closings could fall below the 7-per-month average.",
    "market": "Market investigation findings:\n\n**Pattern**: Median home prices up 8.3% YoY in the greater metro area. Inventory tightening with 12% fewer new listings vs. same period last year.\n\n**Opportunity**: Condo market showing accelerated demand — days on market down 22% for condos vs. 8% for single-family.\n\n**Risk Assessment**: Rising interest rates may cool buyer demand in the $800K+ segment where 2 of Sarah's active listings sit.",
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
