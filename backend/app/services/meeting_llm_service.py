import json
import asyncio
import logging

from langchain_core.messages import SystemMessage, HumanMessage

from app.core.llm import get_llm_streaming, is_llm_configured
from app.schemas.meeting import GenerateDescriptionRequest, RewriteDescriptionRequest

logger = logging.getLogger(__name__)

_PERSONALITY_PROMPTS = {
    "formal": "Use a professional, structured, corporate tone.",
    "casual": "Use a friendly, conversational, relaxed tone.",
    "corporate": "Use an executive-style, concise, business-focused tone.",
    "friendly": "Use a warm, approachable, encouraging tone.",
    "direct": "Use a no-nonsense, concise, action-oriented tone.",
}

MOCK_GENERATE_RESPONSES = {
    "formal": (
        "You are invited to attend a strategic planning session to align on "
        "organisational priorities and resource allocation for the upcoming quarter. "
        "This meeting will provide a forum for leadership to review current performance "
        "metrics, discuss emerging opportunities, and establish clear deliverables.\n\n"
        "**Purpose**\n"
        "Align leadership team on strategic priorities and resource allocation for the "
        "upcoming quarter\n\n"
        "**Desired Outcomes**\n"
        "Approved strategic roadmap, confirmed resource assignments, identified risk "
        "mitigations, and clear accountability framework\n\n"
        "**Agenda**\n"
        "1. Welcome and opening remarks (5 min)\n"
        "2. Review of previous quarter performance (15 min)\n"
        "3. Strategic priorities discussion (20 min)\n"
        "4. Resource allocation and assignments (15 min)\n"
        "5. Risk assessment and mitigation planning (10 min)\n"
        "6. Summary and next steps (5 min)"
    ),
    "casual": (
        "Hey team! Let's get together to chat about what's coming up next quarter. "
        "We'll look at how things went last quarter, talk about what we want to focus "
        "on, and figure out who's doing what. Bring your ideas and let's make a plan "
        "that works for everyone!\n\n"
        "**Purpose**\n"
        "Get everyone on the same page about next quarter's plans\n\n"
        "**Desired Outcomes**\n"
        "A rough plan for next quarter, who's working on what, and any big risks we "
        "need to keep an eye on\n\n"
        "**Agenda**\n"
        "1. Quick check-in (5 min)\n"
        "2. How'd last quarter go? (10 min)\n"
        "3. What should we focus on next? (20 min)\n"
        "4. Who's doing what? (15 min)\n"
        "5. Anything we're worried about? (10 min)\n"
        "6. Wrap up and action items (5 min)"
    ),
}

MOCK_REWRITE_RESPONSES = {
    "formal": (
        "You are cordially invited to attend the quarterly strategic planning session. "
        "This meeting serves as a critical forum for leadership alignment on "
        "organisational priorities, resource allocation, and risk management for the "
        "upcoming quarter.\n\n"
        "**Purpose**\n"
        "Align on Q3 strategic priorities and resource allocation\n\n"
        "**Desired Outcomes**\n"
        "Approved Q3 roadmap, confirmed resource assignments, identified risk mitigations\n\n"
        "**Agenda**\n"
        "1. Welcome and opening remarks (5 min)\n"
        "2. Q2 performance review (15 min)\n"
        "3. Q3 priorities discussion (20 min)\n"
        "4. Resource allocation (15 min)\n"
        "5. Risk assessment (10 min)\n"
        "6. Summary and next steps (5 min)\n\n"
        "Please review the attached pre-read materials in advance and come prepared to "
        "discuss your department's key initiatives and resource requirements."
    ),
    "casual": (
        "Hey everyone! Let's get together for our quarterly planning chat. We'll talk "
        "about what's working, what's not, and what we want to focus on next. No need "
        "to prep anything fancy - just bring your thoughts and we'll figure it out "
        "together!\n\n"
        "**Purpose**\n"
        "Get aligned on next quarter's plans\n\n"
        "**Desired Outcomes**\n"
        "A plan we all agree on, clear next steps\n\n"
        "**Agenda**\n"
        "1. How's it going? (5 min)\n"
        "2. Last quarter recap (10 min)\n"
        "3. What's next? (20 min)\n"
        "4. Who does what? (15 min)\n"
        "5. Wrap up (5 min)"
    ),
    "corporate": (
        "Quarterly Planning Session \u2014 Leadership Alignment Meeting.\n\n"
        "**Purpose**\n"
        "Align on Q3 strategic priorities and resource allocation\n\n"
        "**Desired Outcomes**\n"
        "Approved Q3 roadmap, confirmed resource assignments\n\n"
        "**Agenda**\n"
        "1. Q2 review (15 min)\n"
        "2. Q3 priorities (20 min)\n"
        "3. Resource allocation (15 min)\n"
        "4. Risk assessment (10 min)\n\n"
        "Objective: Set Q3 priorities and assign resources. Pre-reading required. All "
        "VPs and above expected to attend."
    ),
    "friendly": (
        "Hi team! I'd love for us to spend some time together planning for next "
        "quarter. We've achieved some great things this past quarter, and I'm excited "
        "to build on that momentum. Let's discuss our priorities and make sure everyone "
        "has what they need to succeed!\n\n"
        "**Purpose**\n"
        "Plan next quarter together and make sure we're all set up for success\n\n"
        "**Desired Outcomes**\n"
        "Clear priorities, happy team, and a plan we're all excited about\n\n"
        "**Agenda**\n"
        "1. Celebrate wins from last quarter (5 min)\n"
        "2. What should we focus on next? (20 min)\n"
        "3. How can we support each other? (15 min)\n"
        "4. Action items and commitments (10 min)"
    ),
    "direct": (
        "Q3 Planning Meeting.\n\n"
        "**Purpose**\n"
        "Set Q3 priorities and assign resources\n\n"
        "**Desired Outcomes**\n"
        "Approved Q3 roadmap, resource assignments confirmed\n\n"
        "**Agenda**\n"
        "1. Q2 results (10 min)\n"
        "2. Q3 priorities (20 min)\n"
        "3. Resource decisions (15 min)\n"
        "4. Risks and blockers (10 min)\n\n"
        "Bring: Your team's top 3 priorities and resource needs. Duration: 90 minutes. "
        "Decisions will be made in-room."
    ),
}


class MeetingLLMService:
    async def generate_description(self, request: GenerateDescriptionRequest):
        personality_instruction = _PERSONALITY_PROMPTS.get(
            request.personality, _PERSONALITY_PROMPTS["formal"]
        )

        sections = []
        if request.generate_purpose:
            sections.append("Purpose")
        if request.generate_outcomes:
            sections.append("Desired Outcomes")
        if request.generate_agenda:
            sections.append("Agenda")
        if not sections:
            sections = ["Purpose", "Desired Outcomes", "Agenda"]

        system_prompt = (
            f"You are a professional meeting invitation writer. {personality_instruction}\n\n"
            f"Generate a meeting description that includes the following sections: "
            f"{', '.join(sections)}.\n\n"
            f"The user's meeting idea: {request.prompt}\n\n"
            f"{'Additional context: ' + request.context_prompt if request.context_prompt else ''}\n\n"
            f"{'Use this template style: ' + request.template if request.template else ''}\n\n"
            f"Format the description as follows:\n"
            f"- Start with a brief introductory paragraph about the meeting\n"
            f"- Then include each requested section as a bold heading "
            f"(**Purpose**, **Desired Outcomes**, **Agenda**) followed by the content\n"
            f"- For Agenda, use a numbered list\n\n"
            f"Respond with ONLY the description text. No JSON, no markdown fences, "
            f"no explanation."
        )

        if is_llm_configured():
            llm = get_llm_streaming()
            if llm:
                try:
                    messages = [
                        SystemMessage(content=system_prompt),
                        HumanMessage(content=f"Generate meeting description for: {request.prompt}"),
                    ]
                    async for chunk in llm.astream(messages):
                        if chunk.content:
                            data = json.dumps({"field": "description", "content": chunk.content})
                            yield f"data: {data}\n\n"

                    yield f"data: {json.dumps({'type': 'done'})}\n\n"
                    return
                except Exception as e:
                    logger.warning("LLM generate stream failed: %s, falling back to mock", e)

        personality = (
            request.personality if request.personality in MOCK_GENERATE_RESPONSES else "formal"
        )
        text = MOCK_GENERATE_RESPONSES[personality]

        words = text.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == 0 else f" {word}"
            data = json.dumps({"field": "description", "content": chunk})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.02)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    async def rewrite_description(self, request: RewriteDescriptionRequest):
        personality_instruction = _PERSONALITY_PROMPTS.get(
            request.personality, _PERSONALITY_PROMPTS["formal"]
        )

        system_prompt = (
            f"You are a professional meeting invitation writer. {personality_instruction}\n\n"
            f"The user has an existing meeting description and wants you to rewrite or "
            f"improve it.\n\n"
            f"Current description:\n{request.current_description}\n\n"
            f"User's instruction: {request.prompt}\n\n"
            f"{'Additional context: ' + request.context_prompt if request.context_prompt else ''}\n\n"
            f"Rewrite the description based on the user's instruction. If the description "
            f"contains **Purpose**, **Desired Outcomes**, or **Agenda** sections, "
            f"preserve and improve them. Respond with ONLY the rewritten description text, "
            f"no JSON, no markdown fences."
        )

        if is_llm_configured():
            llm = get_llm_streaming()
            if llm:
                try:
                    messages = [
                        SystemMessage(content=system_prompt),
                        HumanMessage(content=f"Rewrite this meeting description: {request.prompt}"),
                    ]
                    async for chunk in llm.astream(messages):
                        if chunk.content:
                            data = json.dumps({"field": "description", "content": chunk.content})
                            yield f"data: {data}\n\n"

                    yield f"data: {json.dumps({'type': 'done'})}\n\n"
                    return
                except Exception as e:
                    logger.warning("LLM rewrite stream failed: %s, falling back to mock", e)

        personality = (
            request.personality if request.personality in MOCK_REWRITE_RESPONSES else "formal"
        )
        text = MOCK_REWRITE_RESPONSES[personality]

        words = text.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == 0 else f" {word}"
            data = json.dumps({"field": "description", "content": chunk})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.03)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"
