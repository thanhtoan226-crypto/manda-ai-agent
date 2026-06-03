import json
import asyncio
from typing import Optional

from langchain_core.messages import SystemMessage, HumanMessage

from app.core.llm import get_llm, get_llm_streaming, is_llm_configured
from app.agents.learning_prompts import (
    LEARNING_SYSTEM_PROMPT,
    build_topic_prompt,
    MODULE_CONTEXT_HINTS,
)
from app.schemas.learning import (
    TopicMeta,
    LearningModule,
    LearningModuleListResponse,
    TopicContent,
    LearningProgressSummary,
    ModuleProgress,
    LearningChatRequest,
)
from app.services.content_loader import (
    get_modules,
    get_topic_meta,
    get_topic_content,
    save_topic_content,
)

LEARNING_PROGRESS: dict[str, bool] = {}


class LearningService:
    def _build_topic_meta(self, t: dict) -> TopicMeta:
        return TopicMeta(
            id=t["id"],
            title=t["title"],
            description=t["description"],
            learning_objective=t["learning_objective"],
            sort_order=t["sort_order"],
            estimated_minutes=t["estimated_minutes"],
            completed=LEARNING_PROGRESS.get(t["id"], False),
        )

    def _build_learning_module(self, mod: dict) -> LearningModule:
        topics = [self._build_topic_meta(t) for t in mod["topics"]]
        completed_count = sum(1 for t in topics if t.completed)
        pct = int((completed_count / len(topics)) * 100) if topics else 0
        return LearningModule(
            id=mod["id"],
            title=mod["title"],
            description=mod["description"],
            icon=mod["icon"],
            sort_order=mod["sort_order"],
            topics=topics,
            progress_percent=pct,
        )

    async def list_modules(self) -> LearningModuleListResponse:
        raw_modules = get_modules()
        modules = [self._build_learning_module(mod) for mod in raw_modules]
        total = sum(len(m.topics) for m in modules)
        completed = sum(1 for m in modules for t in m.topics if t.completed)
        overall = int((completed / total) * 100) if total else 0
        return LearningModuleListResponse(modules=modules, overall_progress_percent=overall)

    async def get_module(self, module_id: str) -> Optional[LearningModule]:
        raw_modules = get_modules()
        mod = next((m for m in raw_modules if m["id"] == module_id), None)
        if not mod:
            return None
        return self._build_learning_module(mod)

    async def get_topic_content(self, module_id: str, topic_id: str) -> Optional[TopicContent]:
        raw_modules = get_modules()
        mod = next((m for m in raw_modules if m["id"] == module_id), None)
        if not mod:
            return None
        topic = next((t for t in mod["topics"] if t["id"] == topic_id), None)
        if not topic:
            return None

        markdown = get_topic_content(topic_id)
        if markdown is None:
            markdown = await self._generate_content(mod, topic)

        return TopicContent(
            topic_id=topic_id,
            title=topic["title"],
            module_id=module_id,
            module_title=mod["title"],
            markdown=markdown,
            completed=LEARNING_PROGRESS.get(topic_id, False),
            estimated_minutes=topic["estimated_minutes"],
        )

    async def update_progress(self, topic_id: str, completed: bool) -> Optional[TopicMeta]:
        raw_modules = get_modules()
        for mod in raw_modules:
            for t in mod["topics"]:
                if t["id"] == topic_id:
                    LEARNING_PROGRESS[topic_id] = completed
                    return TopicMeta(
                        id=t["id"],
                        title=t["title"],
                        description=t["description"],
                        learning_objective=t["learning_objective"],
                        sort_order=t["sort_order"],
                        estimated_minutes=t["estimated_minutes"],
                        completed=completed,
                    )
        return None

    async def get_progress_summary(self) -> LearningProgressSummary:
        raw_modules = get_modules()
        total = 0
        completed = 0
        module_summaries = []

        for mod in raw_modules:
            mod_total = len(mod["topics"])
            mod_completed = sum(1 for t in mod["topics"] if LEARNING_PROGRESS.get(t["id"], False))
            total += mod_total
            completed += mod_completed
            pct = int((mod_completed / mod_total) * 100) if mod_total else 0
            module_summaries.append(
                ModuleProgress(
                    module_id=mod["id"],
                    module_title=mod["title"],
                    completed=mod_completed,
                    total=mod_total,
                    progress_percent=pct,
                )
            )

        overall = int((completed / total) * 100) if total else 0
        return LearningProgressSummary(
            total_topics=total,
            completed_topics=completed,
            overall_percent=overall,
            modules=module_summaries,
        )

    async def _generate_content(self, mod: dict, topic: dict) -> str:
        if is_llm_configured():
            llm = get_llm()
            if llm:
                try:
                    context_hint = MODULE_CONTEXT_HINTS.get(mod["id"], "")
                    messages = [
                        SystemMessage(
                            content=f"{LEARNING_SYSTEM_PROMPT}\n\nContext: {context_hint}"
                        ),
                        HumanMessage(
                            content=build_topic_prompt(
                                mod["title"],
                                topic["title"],
                                topic["learning_objective"],
                                topic["estimated_minutes"],
                            )
                        ),
                    ]
                    result = await llm.ainvoke(messages)
                    markdown = result.content
                    save_topic_content(topic["id"], mod["id"], topic, markdown, generated=True)
                    return markdown
                except Exception:
                    pass

        placeholder = f"# {topic['title']}\n\nContent coming soon."
        save_topic_content(topic["id"], mod["id"], topic, placeholder, generated=False)
        return placeholder

    async def stream_learning_chat(self, request: LearningChatRequest):
        system_content = LEARNING_SYSTEM_PROMPT

        if request.topic_id:
            topic_meta = get_topic_meta(request.topic_id)
            topic_md = get_topic_content(request.topic_id)
            if topic_meta:
                context = "\n\n--- Current Topic Context ---\n"
                context += f"Module: {topic_meta.get('module_id', '')}\n"
                context += f"Topic: {topic_meta.get('title', '')}\n"
                context += f"Learning Objective: {topic_meta.get('learning_objective', '')}\n"
                if topic_md:
                    context += f"\nTopic Content (for reference):\n{topic_md[:2000]}\n"
                system_content += context
        elif request.module_id:
            hint = MODULE_CONTEXT_HINTS.get(request.module_id, "")
            if hint:
                system_content += f"\n\nContext: The user is studying the module about {hint}"

        messages = [
            SystemMessage(content=system_content),
            HumanMessage(content=request.message),
        ]

        if is_llm_configured():
            llm = get_llm_streaming()
            if llm:
                try:
                    async for chunk in llm.astream(messages):
                        if chunk.content:
                            data = json.dumps({"type": "text", "content": chunk.content})
                            yield f"data: {data}\n\n"
                    done_data = json.dumps({"type": "done"})
                    yield f"data: {done_data}\n\n"
                    return
                except Exception as e:
                    import logging

                    logging.getLogger(__name__).warning(f"LLM streaming failed: {e}")

        # Mock fallback
        topic_name = ""
        if request.topic_id:
            meta = get_topic_meta(request.topic_id)
            if meta:
                topic_name = meta.get("title", "")
        if topic_name:
            mock = (
                f"Great question about **{topic_name}**! "
                "Let me explain this in simpler terms. "
                "Think of it like this: every concept in tech has a real-world analogy. "
                "The key thing for BAs to remember is how this connects to your daily work — "
                "writing requirements, talking to stakeholders, and reviewing technical specs. "
                "Would you like me to go deeper into any specific aspect?"
            )
        else:
            mock = (
                "Hello! I'm Manda, your learning assistant. "
                "I can help you understand any technical concept from the learning modules. "
                "Navigate to a specific topic and ask me anything — I'll explain it in plain language "
                "with BA-relevant examples. What would you like to learn about?"
            )
        words = mock.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == 0 else f" {word}"
            data = json.dumps({"type": "text", "content": chunk})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.03)
        done_data = json.dumps({"type": "done"})
        yield f"data: {done_data}\n\n"
