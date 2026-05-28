from datetime import datetime
from typing import Optional

from langchain_core.messages import SystemMessage, HumanMessage

from app.core.llm import get_llm, is_llm_configured
from app.agents.learning_prompts import LEARNING_SYSTEM_PROMPT, build_topic_prompt, MODULE_CONTEXT_HINTS
from app.schemas.learning import (
    TopicMeta,
    LearningModule,
    LearningModuleListResponse,
    TopicContent,
    LearningProgressSummary,
    ModuleProgress,
)
from app.services.mock_data import LEARNING_MODULES, LEARNING_PROGRESS, LEARNING_CONTENT_CACHE, MOCK_TOPIC_CONTENT


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
        modules = [self._build_learning_module(mod) for mod in LEARNING_MODULES]
        total = sum(len(m.topics) for m in modules)
        completed = sum(1 for m in modules for t in m.topics if t.completed)
        overall = int((completed / total) * 100) if total else 0
        return LearningModuleListResponse(modules=modules, overall_progress_percent=overall)

    async def get_module(self, module_id: str) -> Optional[LearningModule]:
        mod = next((m for m in LEARNING_MODULES if m["id"] == module_id), None)
        if not mod:
            return None
        return self._build_learning_module(mod)

    async def get_topic_content(self, module_id: str, topic_id: str) -> Optional[TopicContent]:
        mod = next((m for m in LEARNING_MODULES if m["id"] == module_id), None)
        if not mod:
            return None
        topic = next((t for t in mod["topics"] if t["id"] == topic_id), None)
        if not topic:
            return None

        # Check cache first
        if topic_id in LEARNING_CONTENT_CACHE:
            cached = LEARNING_CONTENT_CACHE[topic_id]
            return TopicContent(
                topic_id=topic_id,
                title=topic["title"],
                module_id=module_id,
                module_title=mod["title"],
                markdown=cached["markdown"],
                completed=LEARNING_PROGRESS.get(topic_id, False),
                estimated_minutes=topic["estimated_minutes"],
            )

        # Generate or use mock
        markdown = await self._generate_content(mod, topic)

        # Cache the result
        LEARNING_CONTENT_CACHE[topic_id] = {
            "markdown": markdown,
            "generated_at": datetime.now().isoformat(),
        }

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
        for mod in LEARNING_MODULES:
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
        total = 0
        completed = 0
        module_summaries = []

        for mod in LEARNING_MODULES:
            mod_total = len(mod["topics"])
            mod_completed = sum(1 for t in mod["topics"] if LEARNING_PROGRESS.get(t["id"], False))
            total += mod_total
            completed += mod_completed
            pct = int((mod_completed / mod_total) * 100) if mod_total else 0
            module_summaries.append(ModuleProgress(
                module_id=mod["id"],
                module_title=mod["title"],
                completed=mod_completed,
                total=mod_total,
                progress_percent=pct,
            ))

        overall = int((completed / total) * 100) if total else 0
        return LearningProgressSummary(
            total_topics=total,
            completed_topics=completed,
            overall_percent=overall,
            modules=module_summaries,
        )

    async def _generate_content(self, mod: dict, topic: dict) -> str:
        """Generate topic content via LLM, fall back to mock."""
        if is_llm_configured():
            llm = get_llm()
            if llm:
                try:
                    context_hint = MODULE_CONTEXT_HINTS.get(mod["id"], "")
                    messages = [
                        SystemMessage(content=f"{LEARNING_SYSTEM_PROMPT}\n\nContext: {context_hint}"),
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
                    return result.content
                except Exception:
                    pass

        return MOCK_TOPIC_CONTENT.get(topic["id"], f"# {topic['title']}\n\nContent coming soon.")
