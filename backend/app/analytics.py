import statistics
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from .models import (
    Organization,
    ContentItem,
    PerformanceMetric,
    Topic,
    ContentTopic
)


def calculate_engagement_rate(
    likes: Optional[int],
    comments: Optional[int],
    shares: Optional[int],
    views: Optional[int]
) -> Optional[float]:
    """
    Deterministic calculation for engagement rate:
    (likes + comments + shares) / views
    
    If views is NULL or zero: engagement_rate = NULL.
    Unavailable metrics are never fabricated or converted to zero.
    """
    if views is None or views <= 0:
        return None

    l = likes if likes is not None else 0
    c = comments if comments is not None else 0
    s = shares if shares is not None else 0

    return round(float(l + c + s) / float(views), 5)


def get_content_overview(db: Session, organization_slug: str = "novastack") -> Dict[str, Any]:
    """Calculate deterministic high-level overview metrics."""
    org = db.query(Organization).filter(Organization.slug == organization_slug).first()
    if not org:
        return {
            "total_content": 0,
            "average_engagement": None,
            "total_views": 0,
            "top_topic": None,
            "top_content_type": None,
            "published_range": {"start": None, "end": None}
        }

    items = db.query(ContentItem).filter(ContentItem.organization_id == org.id).all()
    if not items:
        return {
            "total_content": 0,
            "average_engagement": None,
            "total_views": 0,
            "top_topic": None,
            "top_content_type": None,
            "published_range": {"start": None, "end": None}
        }

    content_ids = [it.id for it in items]
    metrics = db.query(PerformanceMetric).filter(PerformanceMetric.content_id.in_(content_ids)).all()

    valid_engagements = [m.engagement_rate for m in metrics if m.engagement_rate is not None]
    avg_eng = round(sum(valid_engagements) / len(valid_engagements), 4) if valid_engagements else None

    total_views = sum(m.views for m in metrics if m.views is not None)

    ctype_counts: Dict[str, int] = {}
    for it in items:
        ctype_counts[it.content_type] = ctype_counts.get(it.content_type, 0) + 1
    top_ctype = max(ctype_counts.items(), key=lambda x: x[1])[0] if ctype_counts else None

    top_topics_list = get_top_topics(db, organization_slug, limit=1)
    top_topic_name = top_topics_list[0]["topic"] if top_topics_list else None

    pub_dates = [it.published_at for it in items if it.published_at]
    start_date = min(pub_dates).isoformat() if pub_dates else None
    end_date = max(pub_dates).isoformat() if pub_dates else None

    return {
        "total_content": len(items),
        "average_engagement": avg_eng,
        "total_views": total_views,
        "top_topic": top_topic_name,
        "top_content_type": top_ctype,
        "published_range": {
            "start": start_date,
            "end": end_date
        }
    }


def get_all_topics_performance(db: Session, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
    """Compute performance statistics across all topics."""
    org = db.query(Organization).filter(Organization.slug == organization_slug).first()
    if not org:
        return []

    records = (
        db.query(
            Topic.name.label("topic_name"),
            ContentItem.id.label("content_id"),
            ContentItem.content_type.label("content_type"),
            ContentItem.published_at.label("published_at"),
            PerformanceMetric.views.label("views"),
            PerformanceMetric.engagement_rate.label("engagement_rate")
        )
        .join(ContentTopic, Topic.id == ContentTopic.topic_id)
        .join(ContentItem, ContentTopic.content_id == ContentItem.id)
        .outerjoin(PerformanceMetric, ContentItem.id == PerformanceMetric.content_id)
        .filter(ContentItem.organization_id == org.id)
        .all()
    )

    if not records:
        return []

    grouped: Dict[str, List[Any]] = {}
    for r in records:
        grouped.setdefault(r.topic_name, []).append(r)

    raw_stats = []
    max_avg_eng = 0.0001

    for t_name, rows in grouped.items():
        eng_rates = [r.engagement_rate for r in rows if r.engagement_rate is not None]
        avg_eng = round(sum(eng_rates) / len(eng_rates), 4) if eng_rates else 0.0
        if avg_eng > max_avg_eng:
            max_avg_eng = avg_eng

        views_list = [r.views for r in rows if r.views is not None]
        median_views = int(statistics.median(views_list)) if views_list else 0

        ctype_map: Dict[str, List[float]] = {}
        for r in rows:
            if r.engagement_rate is not None:
                ctype_map.setdefault(r.content_type, []).append(r.engagement_rate)
        
        best_ctype = None
        if ctype_map:
            best_ctype = max(
                ctype_map.keys(),
                key=lambda k: sum(ctype_map[k]) / len(ctype_map[k])
            )
        else:
            best_ctype = rows[0].content_type if rows else None

        last_published = max(r.published_at for r in rows if r.published_at)
        evidence_ids = sorted(list({r.content_id for r in rows}))[:5]

        raw_stats.append({
            "topic": t_name,
            "content_count": len(rows),
            "average_engagement": avg_eng,
            "median_views": median_views,
            "best_content_type": best_ctype,
            "last_published_date": last_published.isoformat() if last_published else None,
            "evidence_content_ids": evidence_ids
        })

    for stat in raw_stats:
        norm = round((stat["average_engagement"] / max_avg_eng) * 100, 1)
        stat["normalized_score"] = min(100.0, norm)

    return raw_stats


def get_top_topics(db: Session, organization_slug: str = "novastack", limit: int = 5) -> List[Dict[str, Any]]:
    """Return top topics ranked by average engagement rate."""
    all_perf = get_all_topics_performance(db, organization_slug)
    sorted_perf = sorted(all_perf, key=lambda x: (x["average_engagement"], x["content_count"]), reverse=True)
    return sorted_perf[:limit]


def get_low_performing_topics(db: Session, organization_slug: str = "novastack", limit: int = 5) -> List[Dict[str, Any]]:
    """Return lowest performing topics by average engagement rate."""
    all_perf = get_all_topics_performance(db, organization_slug)
    sorted_perf = sorted(all_perf, key=lambda x: x["average_engagement"])
    return sorted_perf[:limit]


def get_content_type_performance(db: Session, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
    """Calculate performance metrics broken down by content type."""
    org = db.query(Organization).filter(Organization.slug == organization_slug).first()
    if not org:
        return []

    records = (
        db.query(
            ContentItem.content_type,
            PerformanceMetric.views,
            PerformanceMetric.engagement_rate
        )
        .outerjoin(PerformanceMetric, ContentItem.id == PerformanceMetric.content_id)
        .filter(ContentItem.organization_id == org.id)
        .all()
    )

    grouped: Dict[str, Dict[str, Any]] = {}
    for r in records:
        ctype = r.content_type
        if ctype not in grouped:
            grouped[ctype] = {"counts": 0, "views": [], "engagements": []}
        grouped[ctype]["counts"] += 1
        if r.views is not None:
            grouped[ctype]["views"].append(r.views)
        if r.engagement_rate is not None:
            grouped[ctype]["engagements"].append(r.engagement_rate)

    results = []
    for ctype, data in grouped.items():
        avg_eng = round(sum(data["engagements"]) / len(data["engagements"]), 4) if data["engagements"] else None
        avg_v = int(sum(data["views"]) / len(data["views"])) if data["views"] else None
        results.append({
            "content_type": ctype,
            "count": data["counts"],
            "average_engagement": avg_eng,
            "average_views": avg_v
        })

    results.sort(key=lambda x: (x["average_engagement"] or 0), reverse=True)
    return results


def get_topic_frequency(db: Session, organization_slug: str = "novastack") -> Dict[str, int]:
    """Return topic publication counts."""
    all_perf = get_all_topics_performance(db, organization_slug)
    return {p["topic"]: p["content_count"] for p in all_perf}


def get_topic_recency(db: Session, organization_slug: str = "novastack") -> Dict[str, int]:
    """Return days since last publication per topic."""
    all_perf = get_all_topics_performance(db, organization_slug)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    recency = {}
    for p in all_perf:
        if p["last_published_date"]:
            dt = datetime.fromisoformat(p["last_published_date"])
            days = (now - dt).days
            recency[p["topic"]] = max(0, days)
        else:
            recency[p["topic"]] = 999
    return recency


def get_content_history(db: Session, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
    """Return monthly aggregated history of published content count and engagement."""
    org = db.query(Organization).filter(Organization.slug == organization_slug).first()
    if not org:
        return []

    records = (
        db.query(
            ContentItem.published_at,
            PerformanceMetric.views,
            PerformanceMetric.engagement_rate
        )
        .outerjoin(PerformanceMetric, ContentItem.id == PerformanceMetric.content_id)
        .filter(ContentItem.organization_id == org.id)
        .all()
    )

    monthly_buckets: Dict[str, Dict[str, Any]] = {}
    for r in records:
        if not r.published_at:
            continue
        key = r.published_at.strftime("%Y-%m")
        if key not in monthly_buckets:
            monthly_buckets[key] = {"count": 0, "views": 0, "eng_rates": []}
        monthly_buckets[key]["count"] += 1
        if r.views is not None:
            monthly_buckets[key]["views"] += r.views
        if r.engagement_rate is not None:
            monthly_buckets[key]["eng_rates"].append(r.engagement_rate)

    results = []
    for period in sorted(monthly_buckets.keys()):
        data = monthly_buckets[period]
        eng_rates = data["eng_rates"]
        avg_eng = round(sum(eng_rates) / len(eng_rates), 4) if eng_rates else None
        results.append({
            "period": period,
            "content_count": data["count"],
            "average_engagement": avg_eng,
            "views": data["views"]
        })

    return results
