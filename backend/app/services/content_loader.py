import json
from datetime import datetime
from pathlib import Path
from typing import Optional

import frontmatter

from app.core.config import settings

DATA_DIR = Path(settings.LEARNING_DATA_DIR)

_modules_cache: Optional[list[dict]] = None
_topic_cache: dict[str, dict] = {}


def _load_modules_config() -> list[dict]:
    global _modules_cache
    if _modules_cache is not None:
        return _modules_cache
    with open(DATA_DIR / "modules.json") as f:
        raw = json.load(f)
    _modules_cache = raw["modules"]
    return _modules_cache


def _load_topic(topic_id: str) -> None:
    if topic_id in _topic_cache:
        return
    filepath = DATA_DIR / f"{topic_id}.md"
    if not filepath.exists():
        return
    post = frontmatter.load(filepath)
    _topic_cache[topic_id] = {
        "metadata": {
            "id": post.get("id", topic_id),
            "module_id": post.get("module_id", ""),
            "title": post.get("title", ""),
            "description": post.get("description", ""),
            "learning_objective": post.get("learning_objective", ""),
            "sort_order": post.get("sort_order", 0),
            "estimated_minutes": post.get("estimated_minutes", 5),
            "generated": post.get("generated", False),
        },
        "markdown": post.content,
    }


def get_modules() -> list[dict]:
    config = _load_modules_config()
    result = []
    for mod in config:
        topics = []
        for tid in mod["topic_ids"]:
            _load_topic(tid)
            if tid in _topic_cache:
                topics.append(_topic_cache[tid]["metadata"])
        result.append(
            {
                "id": mod["id"],
                "title": mod["title"],
                "description": mod["description"],
                "icon": mod["icon"],
                "sort_order": mod["sort_order"],
                "topics": sorted(topics, key=lambda t: t["sort_order"]),
            }
        )
    return sorted(result, key=lambda m: m["sort_order"])


def get_topic_meta(topic_id: str) -> Optional[dict]:
    _load_topic(topic_id)
    return _topic_cache.get(topic_id, {}).get("metadata")


def get_topic_content(topic_id: str) -> Optional[str]:
    _load_topic(topic_id)
    return _topic_cache.get(topic_id, {}).get("markdown")


def save_topic_content(
    topic_id: str,
    module_id: str,
    metadata: dict,
    markdown: str,
    generated: bool = True,
) -> None:
    filepath = DATA_DIR / f"{topic_id}.md"
    post = frontmatter.Post(
        markdown,
        **{
            "id": topic_id,
            "module_id": module_id,
            "title": metadata.get("title", ""),
            "description": metadata.get("description", ""),
            "learning_objective": metadata.get("learning_objective", ""),
            "sort_order": metadata.get("sort_order", 0),
            "estimated_minutes": metadata.get("estimated_minutes", 5),
            "generated": generated,
            "generated_at": datetime.now().isoformat(),
        },
    )
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w") as f:
        f.write(frontmatter.dumps(post))
    _topic_cache[topic_id] = {
        "metadata": {
            "id": topic_id,
            "module_id": module_id,
            "title": metadata.get("title", ""),
            "description": metadata.get("description", ""),
            "learning_objective": metadata.get("learning_objective", ""),
            "sort_order": metadata.get("sort_order", 0),
            "estimated_minutes": metadata.get("estimated_minutes", 5),
            "generated": generated,
        },
        "markdown": markdown,
    }
