from datetime import datetime, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .analytics import get_all_topics_performance


def get_content_gaps(db: Session, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
    """
    Calculate deterministic content gap scores using the specified formula:
    gap_score = 0.40 * underrepresentation + 0.30 * staleness + 0.30 * related_topic_performance
    
    All factors normalized to 0-1.
    Score output is 0-100.
    """
    all_perf = get_all_topics_performance(db, organization_slug)
    if not all_perf:
        return []

    max_count = max(p["content_count"] for p in all_perf) or 1
    max_engagement = max(p["average_engagement"] for p in all_perf) or 0.001

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    gaps = []

    for p in all_perf:
        topic_name = p["topic"]
        count = p["content_count"]

        # 1. Underrepresentation factor (0-1)
        underrep = round(1.0 - (count / max_count), 2)
        underrep = max(0.0, min(1.0, underrep))

        # 2. Staleness factor (0-1)
        if p["last_published_date"]:
            last_date = datetime.fromisoformat(p["last_published_date"])
            days_ago = max(0, (now - last_date).days)
        else:
            days_ago = 180

        staleness = round(min(1.0, days_ago / 180.0), 2)

        # 3. Related Topic Performance factor (0-1)
        topic_eng = p["average_engagement"]
        eng_factor = topic_eng / max_engagement if max_engagement > 0 else 0.5
        related_perf = round(max(0.2, min(1.0, eng_factor)), 2)

        # Formula: 0.40 * underrep + 0.30 * staleness + 0.30 * related_perf
        combined_factor = (0.40 * underrep) + (0.30 * staleness) + (0.30 * related_perf)
        gap_score = round(combined_factor * 100, 1)

        reasons = []
        if underrep >= 0.70:
            reasons.append(f"Low historical coverage ({count} pieces vs {max_count} peak)")
        if staleness >= 0.60:
            reasons.append(f"Significant content staleness ({days_ago} days since last article)")
        if related_perf >= 0.65:
            reasons.append("High engagement affinity with core technical audience")

        if not reasons:
            reason = "Moderate publication cadence with stable audience engagement."
        else:
            reason = " and ".join(reasons) + "."

        gaps.append({
            "topic": topic_name,
            "gap_score": gap_score,
            "reason": reason,
            "factors": {
                "underrepresentation": underrep,
                "staleness": staleness,
                "related_topic_performance": related_perf
            },
            "evidence_content_ids": p["evidence_content_ids"]
        })

    gaps.sort(key=lambda g: g["gap_score"], reverse=True)
    return gaps
