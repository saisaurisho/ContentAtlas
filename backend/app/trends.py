from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .models import (
    Organization,
    ContentItem,
    Topic,
    ContentTopic
)


def get_topic_trends(db: Session, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
    """
    Calculate topic momentum by comparing:
    - Recent period: last 90 days [today - 90 days, today]
    - Prior period: 90 days immediately preceding the recent period [today - 180 days, today - 90 days)

    Statuses:
    - growing: recent_count >= 2 and (prior_count == 0 or change_pct >= +20%)
    - declining: prior_count >= 2 and (recent_count == 0 or change_pct <= -20%)
    - stable: both periods have activity with change_pct between -20% and +20%
    - insufficient_data: total volume across recent and prior is less than 2
    """
    org = db.query(Organization).filter(Organization.slug == organization_slug).first()
    if not org:
        return []

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    recent_cutoff = now - timedelta(days=90)
    prior_cutoff = now - timedelta(days=180)

    records = (
        db.query(
            Topic.name.label("topic_name"),
            ContentItem.published_at.label("published_at")
        )
        .join(ContentTopic, Topic.id == ContentTopic.topic_id)
        .join(ContentItem, ContentTopic.content_id == ContentItem.id)
        .filter(ContentItem.organization_id == org.id)
        .all()
    )

    topic_buckets: Dict[str, Dict[str, int]] = {}
    for r in records:
        t_name = r.topic_name
        if t_name not in topic_buckets:
            topic_buckets[t_name] = {"recent": 0, "prior": 0, "older": 0}

        pub = r.published_at
        if not pub:
            continue

        if pub >= recent_cutoff:
            topic_buckets[t_name]["recent"] += 1
        elif pub >= prior_cutoff:
            topic_buckets[t_name]["prior"] += 1
        else:
            topic_buckets[t_name]["older"] += 1

    trends = []
    for t_name, counts in topic_buckets.items():
        rec = counts["recent"]
        prior = counts["prior"]
        total_eval = rec + prior

        if total_eval < 2:
            status = "insufficient_data"
            change_pct = None
        elif prior == 0 and rec >= 2:
            status = "growing"
            change_pct = 100.0
        elif rec == 0 and prior >= 2:
            status = "declining"
            change_pct = -100.0
        elif prior > 0:
            diff = rec - prior
            pct = round((diff / prior) * 100.0, 1)
            change_pct = pct
            if pct >= 20.0:
                status = "growing"
            elif pct <= -20.0:
                status = "declining"
            else:
                status = "stable"
        else:
            status = "insufficient_data"
            change_pct = None

        trends.append({
            "topic": t_name,
            "status": status,
            "recent_count": rec,
            "prior_count": prior,
            "change_pct": change_pct
        })

    priority = {"growing": 0, "stable": 1, "declining": 2, "insufficient_data": 3}
    trends.sort(key=lambda x: (priority.get(x["status"], 4), -(x["recent_count"])))
    return trends
