from typing import Optional

from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import SystemMessage, HumanMessage

from app.core.llm import get_llm
from app.agents.prompts import get_prompt, get_module_specs
from app.agents.context import build_context
from app.schemas.content import LLMContentModule


class AgentState(MessagesState):
    agent_id: str
    mode: str
    subject: Optional[str]
    current_module_index: int
    module_specs: list[dict]
    generated_modules: list[dict]


def gather_context(state: AgentState) -> dict:
    """Build context and determine which modules to generate."""
    specs = get_module_specs(state["agent_id"])
    return {
        "module_specs": [{"id": s.id, "title": s.title, "chips": [{"id": c.id, "label": c.label} for c in s.chips]} for s in specs],
        "current_module_index": 0,
        "generated_modules": [],
    }


def generate_module(state: AgentState) -> dict:
    """Generate one content module using structured output."""
    llm = get_llm()
    if not llm:
        return {"generated_modules": []}

    idx = state["current_module_index"]
    specs = state["module_specs"]
    if idx >= len(specs):
        return {}

    spec = specs[idx]
    prompt_config = get_prompt(state["agent_id"], state["mode"])
    context = build_context(state["agent_id"], state.get("subject"), state["mode"])

    chip_descriptions = ", ".join(f'"{c["label"]}" (id: {c["id"]})' for c in spec["chips"])

    content_prompt = f"""{prompt_config.system_prompt}

{context}

Generate a content module titled "{spec['title']}" with these chip sections: {chip_descriptions}.

{prompt_config.content_instructions}

The module must have:
- id: "{spec['id']}"
- title: "{spec['title']}"
- chips: a list of objects with id and label matching the chip sections above
- content: a dict keyed by chip id where:
  - Data Interpreter chips contain: {{"metrics": [{{"label": str, "value": str, "median": str, "position": "above"|"below"|"at"}}], "text": str}}
  - Insight chips contain: {{"items": [str]}}
  - Table chips contain: {{"headers": [{{"key": str, "label": str}}], "table": [dict]}}
  - Mixed chips contain: {{"items": [str], "text": str}}

Respond with a single JSON object matching this schema."""

    structured_llm = llm.with_structured_output(LLMContentModule)
    messages = [
        SystemMessage(content=content_prompt),
        HumanMessage(
            content=f'Generate the "{spec["title"]}" module in {prompt_config.tone} tone for {state["mode"]} mode.'
        ),
    ]

    try:
        result = structured_llm.invoke(messages)
        module_dict = result.model_dump()
        module_dict.setdefault("id", spec["id"])
        module_dict.setdefault("title", spec["title"])
        for chip in module_dict.get("chips", []):
            chip.setdefault("enabled", chip.get("id", "").endswith("-data") or chip.get("id") == "chip-data")
    except Exception:
        module_dict = {
            "id": spec["id"],
            "title": spec["title"],
            "chips": spec["chips"],
            "content": {},
        }

    new_modules = state["generated_modules"] + [module_dict]
    return {
        "current_module_index": idx + 1,
        "generated_modules": new_modules,
    }


def should_continue(state: AgentState) -> str:
    """Route: continue generating modules or end."""
    if state["current_module_index"] >= len(state["module_specs"]):
        return "end"
    return "continue"


def build_agent_graph():
    """Build the core LangGraph agent graph for Manda."""
    graph = StateGraph(AgentState)

    graph.add_node("gather_context", gather_context)
    graph.add_node("generate_module", generate_module)

    graph.add_edge(START, "gather_context")
    graph.add_conditional_edges(
        "gather_context",
        should_continue,
        {"continue": "generate_module", "end": END},
    )
    graph.add_conditional_edges(
        "generate_module",
        should_continue,
        {"continue": "generate_module", "end": END},
    )

    return graph.compile()
