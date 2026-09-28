import os
import sys

# Ensure project root is in sys.path so backend package can be imported
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import time
from dotenv import load_dotenv
from hindsight_client import Hindsight

from backend.app.database import SessionLocal
from backend.app.service import (
    get_top_topics,
    get_low_performing_topics,
    get_content_type_performance,
    get_topic_frequency,
    get_topic_recency,
)

load_dotenv()

BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "content-strategy-main-v3")
ORGANIZATION_SLUG = "novastack"


def retain_with_retry(
    hindsight: Hindsight,
    bank_id: str,
    content: str,
    document_id: str,
    metadata: dict,
    max_retries: int = 5,
    initial_delay: float = 2.0,
):
    """
    Retain memory with exponential backoff for transient server or gateway errors.
    """
    delay = initial_delay
    for attempt in range(1, max_retries + 1):
        try:
            return hindsight.retain(
                bank_id=bank_id,
                content=content,
                document_id=document_id,
                metadata=metadata,
                update_mode="replace",
            )
        except Exception as e:
            if attempt == max_retries:
                raise
            print(f"  [Attempt {attempt}/{max_retries}] Retain temporarily failed ({e}). Retrying in {delay:.1f}s...")
            time.sleep(delay)
            delay *= 2


def build_insight_candidates(db):
    """
    Generate deterministic memory candidates from Team 3 analytics.
    Avoid storing contradictory performance labels for the same topic.
    """

    candidates = []

    # ---------------------------------------------------------
    # 1. TOP-PERFORMING TOPICS
    # ---------------------------------------------------------

    top_topics = get_top_topics(
        db,
        organization_slug=ORGANIZATION_SLUG,
        limit=5,
    )

    top_topic_names = set()

    for item in top_topics:
        topic = item["topic"]
        top_topic_names.add(topic)

        statement = (
            f"{topic} content performs strongly for NovaStack, "
            f"with an average engagement rate of "
            f"{item['average_engagement']} across "
            f"{item['content_count']} content items."
        )

        candidates.append(
            {
                "insight_key": f"performance:topic:{topic}",
                "kind": "performance_pattern",
                "statement": statement,
                "evidence_content_ids": item.get(
                    "evidence_content_ids", []
                ),
            }
        )

    # ---------------------------------------------------------
    # 2. LOW-PERFORMING TOPICS
    # ---------------------------------------------------------

    low_topics = get_low_performing_topics(
        db,
        organization_slug=ORGANIZATION_SLUG,
        limit=5,
    )

    for item in low_topics:
        topic = item["topic"]

        # Do not store a topic as both strong and low-performing.
        if topic in top_topic_names:
            continue

        statement = (
            f"{topic} has relatively low historical engagement "
            f"for NovaStack, with an average engagement rate of "
            f"{item['average_engagement']} across "
            f"{item['content_count']} content items."
        )

        candidates.append(
            {
                "insight_key": f"performance:low:{topic}",
                "kind": "low_performance_pattern",
                "statement": statement,
                "evidence_content_ids": item.get(
                    "evidence_content_ids", []
                ),
            }
        )

    # ---------------------------------------------------------
    # 3. CONTENT-TYPE PERFORMANCE
    # ---------------------------------------------------------

    content_types = get_content_type_performance(
        db,
        organization_slug=ORGANIZATION_SLUG,
    )

    for item in content_types:
        content_type = item["content_type"]

        statement = (
            f"{content_type} content has an average engagement "
            f"rate of {item['average_engagement']} for NovaStack "
            f"across {item['count']} content items."
        )

        candidates.append(
            {
                "insight_key": f"performance:content_type:{content_type}",
                "kind": "content_type_performance",
                "statement": statement,
                "evidence_content_ids": [],
            }
        )

    # ---------------------------------------------------------
    # 4. TOPIC FREQUENCY
    # ---------------------------------------------------------

    topic_frequency = get_topic_frequency(
        db,
        organization_slug=ORGANIZATION_SLUG,
    )

    for topic, count in topic_frequency.items():
        statement = (
            f"NovaStack has published {count} content items "
            f"related to {topic}."
        )

        candidates.append(
            {
                "insight_key": f"coverage:frequency:{topic}",
                "kind": "topic_frequency",
                "statement": statement,
                "evidence_content_ids": [],
            }
        )

    # ---------------------------------------------------------
    # 5. TOPIC RECENCY
    # ---------------------------------------------------------

    topic_recency = get_topic_recency(
        db,
        organization_slug=ORGANIZATION_SLUG,
    )

    for topic, days in topic_recency.items():
        statement = (
            f"NovaStack last published content regarding "
            f"{topic} approximately {days} days ago."
        )

        candidates.append(
            {
                "insight_key": f"coverage:recency:{topic}",
                "kind": "topic_recency",
                "statement": statement,
                "evidence_content_ids": [],
            }
        )

    return candidates


def main():
    print("Starting NovaStack memory initialization...")
    print()

    api_key = os.getenv("HINDSIGHT_API_KEY")
    if not api_key:
        print("ERROR: HINDSIGHT_API_KEY environment variable is not set in .env")
        sys.exit(1)

    db = SessionLocal()

    try:
        insight_candidates = build_insight_candidates(db)

        print(
            f"Generated {len(insight_candidates)} "
            f"analytics insights."
        )
        print()

    finally:
        db.close()

    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")

    with Hindsight(
        base_url=base_url,
        api_key=api_key,
    ) as hindsight:

        for item in insight_candidates:
            retain_with_retry(
                hindsight=hindsight,
                bank_id=BANK_ID,
                content=item["statement"],
                document_id=item["insight_key"],
                metadata={
                    "insight_key": item["insight_key"],
                    "kind": item["kind"],
                    "evidence_content_ids": ",".join(
                        str(x) for x in item.get("evidence_content_ids", [])
                    ),
                },
            )

            print(f"Stored: {item['insight_key']}")
            time.sleep(0.3)

    print()
    print("Memory initialization complete!")


if __name__ == "__main__":
    main()
