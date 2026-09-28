import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from .analytics import (
    get_content_overview as _analytics_overview,
    get_top_topics as _analytics_top_topics,
    get_low_performing_topics as _analytics_low_topics,
    get_content_type_performance as _analytics_ctype_perf,
    get_topic_frequency as _analytics_topic_freq,
    get_topic_recency as _analytics_topic_recency,
    get_content_history as _analytics_history,
)
from .gaps import get_content_gaps as _analytics_gaps
from .trends import get_topic_trends as _analytics_trends
from .models import Organization, Recommendation, RecommendationOutcome


def get_brand_voice(organization_slug: str = "novastack") -> Dict[str, List[str]]:
    """
    Return deterministic structured brand voice profile.
    P0 implementation uses structured configuration without requiring a database table.
    """
    return {
        "tone": [
            "technical",
            "concise",
            "practical",
            "evidence-oriented"
        ],
        "preferred_words": [
            "benchmark",
            "pipeline",
            "trade-off",
            "deterministic",
            "production"
        ],
        "avoid_words": [
            "revolutionary",
            "game-changing",
            "silver bullet",
            "next-level"
        ]
    }


class AnalyticsService:
    """
    Clean service layer exposed to Team 1 and FastAPI endpoints.
    Shields consumers from direct database tables, queries, and SQL.
    Returns clean, serializable Python dictionaries.
    """

    def __init__(self, db: Session):
        self.db = db
        self._rec_service = RecommendationService(db)
        self._bridge = HindsightBridge(db)

    def get_content_overview(self, organization_slug: str = "novastack") -> Dict[str, Any]:
        return _analytics_overview(self.db, organization_slug)

    # Alias for backward compatibility
    def get_overview(self, organization_slug: str = "novastack") -> Dict[str, Any]:
        return self.get_content_overview(organization_slug)

    def get_top_topics(self, organization_slug: str = "novastack", limit: int = 5) -> List[Dict[str, Any]]:
        return _analytics_top_topics(self.db, organization_slug, limit)

    def get_low_performing_topics(self, organization_slug: str = "novastack", limit: int = 5) -> List[Dict[str, Any]]:
        return _analytics_low_topics(self.db, organization_slug, limit)

    def get_content_type_performance(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        return _analytics_ctype_perf(self.db, organization_slug)

    def get_topic_frequency(self, organization_slug: str = "novastack") -> Dict[str, int]:
        return _analytics_topic_freq(self.db, organization_slug)

    def get_topic_recency(self, organization_slug: str = "novastack") -> Dict[str, int]:
        return _analytics_topic_recency(self.db, organization_slug)

    def get_content_gaps(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        return _analytics_gaps(self.db, organization_slug)

    def get_topic_trends(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        return _analytics_trends(self.db, organization_slug)

    def get_content_history(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        return _analytics_history(self.db, organization_slug)

    def get_brand_voice(self, organization_slug: str = "novastack") -> Dict[str, List[str]]:
        return get_brand_voice(organization_slug)

    def get_insight_candidates(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        """Bridge function to generate deduplicatable insight candidates for Hindsight retention."""
        return self._bridge.generate_insight_candidates(organization_slug)

    def save_recommendation(
        self,
        title: str,
        rationale: str,
        target_topic: str,
        content_type: str,
        supporting_content_ids: List[int] = None,
        supporting_memory_refs: List[str] = None,
        outline: List[str] = None,
        recommendation_type: str = "content_creation",
        status: str = "pending",
        organization_slug: str = "novastack"
    ) -> Dict[str, Any]:
        return self._rec_service.save_recommendation(
            title=title,
            rationale=rationale,
            target_topic=target_topic,
            content_type=content_type,
            supporting_content_ids=supporting_content_ids,
            supporting_memory_refs=supporting_memory_refs,
            outline=outline,
            recommendation_type=recommendation_type,
            status=status,
            organization_slug=organization_slug
        )

    def record_outcome(
        self,
        recommendation_id: int,
        outcome_type: str,
        metrics: Optional[Dict[str, Any]] = None,
        notes: Optional[str] = None,
        content_id: Optional[int] = None
    ) -> Dict[str, Any]:
        return self._rec_service.record_outcome(
            recommendation_id=recommendation_id,
            outcome_type=outcome_type,
            metrics=metrics,
            notes=notes,
            content_id=content_id
        )


class RecommendationService:
    """Service to handle recommendations and outcomes persistence."""

    def __init__(self, db: Session):
        self.db = db

    def save_recommendation(
        self,
        title: str,
        rationale: str,
        target_topic: str,
        content_type: str,
        supporting_content_ids: List[int] = None,
        supporting_memory_refs: List[str] = None,
        outline: List[str] = None,
        recommendation_type: str = "content_creation",
        status: str = "pending",
        organization_slug: str = "novastack"
    ) -> Dict[str, Any]:
        org = self.db.query(Organization).filter(Organization.slug == organization_slug).first()
        if not org:
            raise ValueError(f"Organization '{organization_slug}' not found.")

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        rec = Recommendation(
            organization_id=org.id,
            recommendation_type=recommendation_type,
            title=title,
            rationale=rationale,
            target_topic=target_topic,
            content_type=content_type,
            supporting_content_ids=supporting_content_ids or [],
            supporting_memory_refs=supporting_memory_refs or [],
            outline=outline or [],
            status=status,
            created_at=now
        )
        self.db.add(rec)
        self.db.commit()
        self.db.refresh(rec)

        return {
            "id": rec.id,
            "organization_id": rec.organization_id,
            "recommendation_type": rec.recommendation_type,
            "title": rec.title,
            "rationale": rec.rationale,
            "target_topic": rec.target_topic,
            "content_type": rec.content_type,
            "supporting_content_ids": rec.supporting_content_ids,
            "supporting_memory_refs": rec.supporting_memory_refs,
            "outline": rec.outline,
            "status": rec.status,
            "created_at": rec.created_at.isoformat()
        }

    def record_outcome(
        self,
        recommendation_id: int,
        outcome_type: str,
        metrics: Optional[Dict[str, Any]] = None,
        notes: Optional[str] = None,
        content_id: Optional[int] = None
    ) -> Dict[str, Any]:
        rec = self.db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
        if not rec:
            raise ValueError(f"Recommendation ID {recommendation_id} not found.")

        if outcome_type in ["accepted", "rejected", "published"]:
            rec.status = outcome_type

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        outcome = RecommendationOutcome(
            recommendation_id=recommendation_id,
            content_id=content_id,
            outcome_type=outcome_type,
            metrics=metrics or {},
            notes=notes,
            recorded_at=now
        )
        self.db.add(outcome)
        self.db.commit()
        self.db.refresh(outcome)

        return {
            "id": outcome.id,
            "recommendation_id": outcome.recommendation_id,
            "content_id": outcome.content_id,
            "outcome_type": outcome.outcome_type,
            "metrics": outcome.metrics,
            "notes": outcome.notes,
            "recorded_at": outcome.recorded_at.isoformat()
        }


def slugify_key(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "_", text).strip("_")


class HindsightBridge:
    """
    Bridge connecting Team 3 Analytics to Team 1 Hindsight memory.
    Transforms deterministic PostgreSQL analytics and outcomes into high-fidelity,
    deduplicatable insight candidates ready for Hindsight.retain().
    """

    def __init__(self, db: Session):
        self.db = db

    def generate_insight_candidates(self, organization_slug: str = "novastack") -> List[Dict[str, Any]]:
        candidates = []

        # 1. Top topic performance insights
        top_topics = _analytics_top_topics(self.db, organization_slug, limit=3)
        for t in top_topics:
            t_name = t["topic"]
            eng_pct = round(t["average_engagement"] * 100, 1) if t["average_engagement"] else 0.0
            count = t["content_count"]
            ctype = t["best_content_type"] or "technical articles"

            key = f"performance:topic:{slugify_key(t_name)}"
            statement = (
                f"{t_name} content has historically performed strongly for NovaStack, "
                f"averaging {eng_pct}% engagement rate across {count} publications, "
                f"with {ctype} achieving peak engagement."
            )
            candidates.append({
                "insight_key": key,
                "kind": "performance_pattern",
                "statement": statement,
                "evidence_content_ids": t["evidence_content_ids"]
            })

        # 2. Content format preference insights
        ctypes = _analytics_ctype_perf(self.db, organization_slug)
        if ctypes:
            best_type = ctypes[0]
            best_eng_pct = round((best_type["average_engagement"] or 0) * 100, 1)
            candidates.append({
                "insight_key": f"preference:format:{slugify_key(best_type['content_type'])}",
                "kind": "format_preference",
                "statement": (
                    f"NovaStack's audience strongly prefers {best_type['content_type']}s, "
                    f"which generate {best_eng_pct}% average engagement and outperform other formats."
                ),
                "evidence_content_ids": []
            })

        # 3. Content gaps insights (Top gaps)
        gaps = _analytics_gaps(self.db, organization_slug)
        for g in gaps[:2]:
            t_name = g["topic"]
            score = g["gap_score"]
            key = f"gap:topic:{slugify_key(t_name)}"
            statement = (
                f"{t_name} represents a major content gap for NovaStack (gap score: {score}/100) "
                f"due to {g['reason'].lower()}"
            )
            candidates.append({
                "insight_key": key,
                "kind": "content_gap",
                "statement": statement,
                "evidence_content_ids": g["evidence_content_ids"]
            })

        # 4. Low-performing topic cautions
        low_topics = _analytics_low_topics(self.db, organization_slug, limit=2)
        for lt in low_topics:
            lt_name = lt["topic"]
            lt_eng_pct = round((lt["average_engagement"] or 0) * 100, 1)
            candidates.append({
                "insight_key": f"caution:topic:{slugify_key(lt_name)}",
                "kind": "performance_caution",
                "statement": (
                    f"{lt_name} content has underperformed historical benchmarks, "
                    f"averaging only {lt_eng_pct}% engagement. Broad or generic coverage should be avoided."
                ),
                "evidence_content_ids": lt["evidence_content_ids"]
            })

        return candidates

    def generate_outcome_insight(self, outcome_id: int) -> Optional[Dict[str, Any]]:
        outcome = self.db.query(RecommendationOutcome).filter(RecommendationOutcome.id == outcome_id).first()
        if not outcome:
            return None

        rec = self.db.query(Recommendation).filter(Recommendation.id == outcome.recommendation_id).first()
        rec_title = rec.title if rec else "Recommended strategy"

        metrics = outcome.metrics or {}
        views = metrics.get("views")
        eng_rate = metrics.get("engagement_rate")

        if eng_rate is not None:
            eng_str = f"with {round(eng_rate * 100, 1)}% engagement"
        else:
            eng_str = "with positive response"

        views_str = f" and {views} views" if views else ""

        statement = (
            f"Strategy recommendation '{rec_title}' was executed and {outcome.outcome_type} "
            f"{eng_str}{views_str}. Notes: {outcome.notes or 'Performance verified.'}"
        )

        return {
            "insight_key": f"outcome:recommendation:{outcome.recommendation_id}",
            "kind": "recommendation_outcome",
            "statement": statement,
            "evidence_content_ids": [outcome.content_id] if outcome.content_id else []
        }
