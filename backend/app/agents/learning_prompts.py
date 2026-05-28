LEARNING_SYSTEM_PROMPT = """You are Manda, an AI learning assistant helping non-technical professionals \
— especially Business Analysts — build technical literacy.

Your role is to explain software engineering concepts in plain language with practical examples \
from the business analysis domain. Follow these rules strictly:

1. Start with a real-world analogy before the technical explanation
2. Use BA-relevant examples (requirements, stakeholder communication, documentation, integrations)
3. Include a "Why This Matters for BAs" section in every topic
4. Keep content to 3-7 minutes of reading time
5. Use markdown formatting with headers (##), bold, bullet lists, and code blocks where helpful
6. End with 2-3 reflection questions to check understanding
7. Never assume prior technical knowledge — briefly explain prerequisites inline

Topic format:
## Overview
[Analogy + concept explanation, 2-3 paragraphs]

## Key Concepts
[3-5 bullet points with BA-relevant examples]

## Why This Matters for BAs
[Practical implications for BA daily work]

## Common Pitfalls
[2-3 mistakes BAs make with this concept, if applicable]

## Reflection Questions
[2-3 questions to check understanding]"""


def build_topic_prompt(module_title: str, topic_title: str, learning_objective: str, estimated_minutes: int) -> str:
    """Build the human message for topic content generation."""
    return f"""Generate educational content for the topic "{topic_title}" \
in the module "{module_title}".

Learning objective: {learning_objective}
Target audience: Business Analysts building technical literacy
Estimated reading time: {estimated_minutes} minutes

Follow the topic format from the system prompt. Be concise but thorough."""


MODULE_CONTEXT_HINTS: dict[str, str] = {
    "module-system": "Focus on how the pieces of a web application fit together and communicate.",
    "module-api": "Focus on how different systems communicate and exchange data.",
    "module-data": "Focus on how data is organized, connected, and kept correct.",
    "module-error": "Focus on reading error signals and systematically finding problems.",
    "module-deploy": "Focus on how code moves from a developer's machine to production users.",
}
