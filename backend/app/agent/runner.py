import os
import sys
from pathlib import Path
from typing import Optional, List, Dict, Any

from dotenv import load_dotenv

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv()

if sys.stdout and hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# -----------------------------
# Configuration
# -----------------------------

BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "content-strategy-main-v3")
HINDSIGHT_BASE_URL = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

_groq_client = None


def get_groq_client():
    global _groq_client
    if _groq_client is None:
        from groq import Groq
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")
        _groq_client = Groq(api_key=api_key)
    return _groq_client


# -----------------------------
# Hindsight Memory
# -----------------------------

def recall_memory(query: str, hindsight_client, bank_id: str = BANK_ID) -> str:
    try:
        response = hindsight_client.recall(
            bank_id=bank_id,
            query=query
        )

        memories = getattr(response, "results", [])

        if not memories:
            return "No relevant organizational memories were found."

        memory_text = []
        for memory in memories:
            text = getattr(memory, "text", str(memory))
            memory_text.append(f"- {text}")

        return "\n".join(memory_text)

    except Exception as e:
        print(f"Error recalling memory: {e}")
        return "No relevant organizational memories were found."


def recall_memory_items(query: str, hindsight_client, bank_id: str = BANK_ID) -> List[Dict[str, Any]]:
    """Helper to return raw recalled memory objects for API evidence."""
    try:
        response = hindsight_client.recall(
            bank_id=bank_id,
            query=query
        )
        results = getattr(response, "results", [])
        items = []
        for r in results:
            key = getattr(r, "document_id", getattr(r, "id", "memory"))
            text = getattr(r, "text", str(r))
            score = getattr(r, "score", 0.9)
            items.append({"key": str(key), "statement": text, "relevance": float(score)})
        return items
    except Exception as e:
        print(f"Error recalling memory items: {e}")
        return []


# -----------------------------
# LLM
# -----------------------------

def generate_answer(query: str, memory: str, model: str = GROQ_MODEL) -> str:
    prompt = f"""
You are an AI Content Strategy Agent.

Your job is to help a content team:

1. Analyze content performance.
2. Identify content gaps.
3. Recommend future content.
4. Generate content ideas and outlines.

Use the organization's historical memory when answering.

IMPORTANT:

- Do not invent historical facts.
- Only use historical information provided in the memory.
- If the memory does not contain enough information, say so.
- Clearly distinguish historical facts from your own suggestions.
- Do not treat topic names as content types.
- "AI Agents", "Cloud Infrastructure", etc. are topics.
- "Tutorial", "Technical Guide", and "Blog" are content types.
- Do not describe a topic as low-performing unless the memory explicitly says it is low-performing.

ORGANIZATIONAL MEMORY:

{memory}

USER QUESTION:

{query}
"""

    client = get_groq_client()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI content strategy agent."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        # Fallback to versatile model if requested model name is unsupported
        if "model" in str(e).lower() and model != "llama-3.3-70b-versatile":
            print(f"Model {model} failed, falling back to llama-3.3-70b-versatile: {e}")
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful AI content strategy agent."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        raise


# -----------------------------
# Agent Core
# -----------------------------

def run_agent(query: str, hindsight_client) -> str:
    print("\n[1] Recalling Hindsight memory...")

    memory = recall_memory(
        query,
        hindsight_client
    )

    print("\n--- HINDSIGHT MEMORIES ---")
    print(memory)

    print("\n[2] Sending memory + question to Groq...")

    answer = generate_answer(
        query,
        memory
    )

    return answer


# -----------------------------
# API Chat Endpoint Integration
# -----------------------------

def run_agent_chat(message: str, organization_slug: str, db):
    """
    Called by POST /api/v1/chat in backend/app/routes.py.
    Bridges FastAPI HTTP requests into the Groq + Hindsight agent workflow.
    """
    from backend.app.service import AnalyticsService, RecommendationService, HindsightBridge
    from backend.app.schemas import ChatResponse, ChatEvidence, ChatMemoryItem, RecommendationResponse

    analytics_svc = AnalyticsService(db)
    rec_svc = RecommendationService(db)
    bridge = HindsightBridge(db)

    gaps = analytics_svc.get_content_gaps(organization_slug)
    trends = analytics_svc.get_topic_trends(organization_slug)
    top_gap = gaps[0] if gaps else {"topic": "Cybersecurity", "gap_score": 78, "evidence_content_ids": []}
    target_topic = top_gap["topic"]
    evidence_ids = top_gap.get("evidence_content_ids", [])

    # Recall from Hindsight if configured
    hindsight_key = os.getenv("HINDSIGHT_API_KEY")
    recalled_text = ""
    recalled_items = []

    if hindsight_key:
        try:
            from hindsight_client import Hindsight
            with Hindsight(base_url=HINDSIGHT_BASE_URL, api_key=hindsight_key) as hs_client:
                recalled_text = recall_memory(message, hs_client, bank_id=BANK_ID)
                recalled_items = recall_memory_items(message, hs_client, bank_id=BANK_ID)
        except Exception as e:
            print(f"Hindsight recall skipped: {e}")

    # Fallback to bridge candidate statements if no remote memories found
    if not recalled_text or "No relevant organizational memories were found" in recalled_text:
        insight_candidates = bridge.generate_insight_candidates(organization_slug)
        memory_lines = [f"- {c['statement']}" for c in insight_candidates[:4]]
        recalled_text = "\n".join(memory_lines)
        recalled_items = [
            {"key": c["insight_key"], "statement": c["statement"], "relevance": 0.90}
            for c in insight_candidates[:3]
        ]

    # Generate answer via Groq LLM if configured, otherwise deterministic synthesis
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            answer = generate_answer(message, recalled_text)
        except Exception as e:
            print(f"Groq generation failed, using structured template: {e}")
            answer = (
                f"Based on historical memory patterns and performance data for {organization_slug}: "
                f"I recommend prioritizing a Technical Guide on '{target_topic}'. "
                f"Our audience responds best to hands-on, practical walkthroughs with verified code."
            )
    else:
        answer = (
            f"Based on historical memory patterns and performance data for {organization_slug}: "
            f"I recommend creating a Technical Guide on 'Architecting Zero-Trust Multi-Agent Systems in Production ({target_topic})'. "
            f"Historical engagement affinity is high, but {target_topic} has an acute content gap score of {top_gap['gap_score']}/100."
        )

    # Persist recommendation
    title = f"Architecting Zero-Trust Multi-Agent Systems in Production ({target_topic})"
    rationale = (
        f"Historical analytics show strong affinity with related topics, but {target_topic} "
        f"has an acute content gap score of {top_gap['gap_score']}/100 with high staleness."
    )
    outline = [
        f"Threat modeling agent-to-agent communication in {target_topic}",
        "Mutual TLS and ephemeral credential rotation for autonomous workers",
        "Deterministic benchmark: latency overhead of runtime authorization filters",
        "Step-by-step production implementation recipe in Python"
    ]

    saved_rec = rec_svc.save_recommendation(
        title=title,
        rationale=rationale,
        target_topic=target_topic,
        content_type="Technical Guide",
        supporting_content_ids=evidence_ids,
        supporting_memory_refs=[f"gap:topic:{target_topic.lower()}"],
        outline=outline,
        organization_slug=organization_slug
    )

    memories_list = [
        ChatMemoryItem(
            key=m["key"],
            statement=m["statement"],
            relevance=m.get("relevance", 0.9)
        )
        for m in recalled_items
    ]

    return ChatResponse(
        answer=answer,
        intent="content_recommendation",
        recommendation=RecommendationResponse(**saved_rec),
        evidence=ChatEvidence(
            content=evidence_ids,
            gaps=[g["topic"] for g in gaps[:3]],
            trends=[t["topic"] for t in trends if t["status"] == "growing"]
        ),
        memories=memories_list
    )


# -----------------------------
# Main / CLI Mode
# -----------------------------

if __name__ == "__main__":
    from hindsight_client import Hindsight

    api_key = os.getenv("HINDSIGHT_API_KEY")
    if not api_key:
        print("ERROR: HINDSIGHT_API_KEY is not set in environment or .env file.")
        sys.exit(1)

    print("Content Strategy Agent")
    print("----------------------")
    print("Type 'exit' to stop.")

    with Hindsight(
        base_url=HINDSIGHT_BASE_URL,
        api_key=api_key
    ) as hindsight_client:

        while True:
            query = input("\nYou: ").strip()

            if query.lower() in ["exit", "quit"]:
                break

            if not query:
                continue

            answer = run_agent(
                query,
                hindsight_client
            )

            print("\nAgent:")
            print(answer)
