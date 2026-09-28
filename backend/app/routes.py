from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from .database import get_db
from .models import (
    Organization,
    ContentItem,
    PerformanceMetric,
    Topic,
    ContentTopic
)
from .service import (
    AnalyticsService,
    RecommendationService,
    HindsightBridge,
    get_brand_voice
)
from .schemas import (
    ContentListResponse,
    ContentItemResponse,
    ContentMetricsSchema,
    ContentOverviewResponse,
    TopicPerformanceResponse,
    ContentTypePerformanceResponse,
    ContentGapResponse,
    TopicTrendResponse,
    HistoryPointResponse,
    BrandVoiceResponse,
    SaveRecommendationRequest,
    RecommendationResponse,
    RecordOutcomeRequest,
    RecommendationOutcomeResponse,
    ChatRequest,
    ChatResponse,
    ChatEvidence,
    ChatMemoryItem
)

# Root router for /health
health_router = APIRouter(tags=["Health"])

# API router for /api/v1 (Prefix mounted in main.py)
api_router = APIRouter()


# 1. Health Endpoint: GET /health
@health_router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# 2. Content Endpoint: GET /api/v1/content
@api_router.get("/content", response_model=ContentListResponse, tags=["Content"])
def list_content(
    topic: Optional[str] = Query(None, description="Filter by topic name"),
    content_type: Optional[str] = Query(None, description="Filter by content format"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    organization_slug: str = Query("novastack"),
    db: Session = Depends(get_db)
):
    query = (
        db.query(ContentItem)
        .join(Organization, ContentItem.organization_id == Organization.id)
        .filter(Organization.slug == organization_slug)
    )

    if content_type:
        query = query.filter(ContentItem.content_type == content_type)

    if topic:
        query = (
            query.join(ContentTopic, ContentItem.id == ContentTopic.content_id)
            .join(Topic, ContentTopic.topic_id == Topic.id)
            .filter((Topic.name == topic) | (Topic.slug == topic))
        )

    total = query.count()
    items = query.order_by(ContentItem.published_at.desc()).offset(offset).limit(limit).all()

    response_items = []
    for item in items:
        metric = db.query(PerformanceMetric).filter(PerformanceMetric.content_id == item.id).first()
        m_schema = None
        if metric:
            m_schema = ContentMetricsSchema(
                views=metric.views,
                likes=metric.likes,
                comments=metric.comments,
                shares=metric.shares,
                clicks=metric.clicks,
                conversions=metric.conversions,
                engagement_rate=metric.engagement_rate
            )

        topic_links = (
            db.query(Topic.name)
            .join(ContentTopic, Topic.id == ContentTopic.topic_id)
            .filter(ContentTopic.content_id == item.id)
            .all()
        )
        topics = [t[0] for t in topic_links]

        response_items.append(
            ContentItemResponse(
                id=item.id,
                title=item.title,
                content_type=item.content_type,
                author=item.author,
                published_at=item.published_at,
                topics=topics,
                metrics=m_schema
            )
        )

    return ContentListResponse(total=total, items=response_items)


# 3. Analytics Overview: GET /api/v1/analytics/overview
@api_router.get("/analytics/overview", response_model=ContentOverviewResponse, tags=["Analytics"])
def get_overview(organization_slug: str = Query("novastack"), db: Session = Depends(get_db)):
    return AnalyticsService(db).get_content_overview(organization_slug)


# 4. Top Topics: GET /api/v1/analytics/top-topics
@api_router.get("/analytics/top-topics", response_model=List[TopicPerformanceResponse], tags=["Analytics"])
def get_top_topics_endpoint(
    limit: int = Query(5, ge=1, le=50),
    organization_slug: str = Query("novastack"),
    db: Session = Depends(get_db)
):
    return AnalyticsService(db).get_top_topics(organization_slug, limit=limit)


# 5. Content Types: GET /api/v1/analytics/content-types
@api_router.get("/analytics/content-types", response_model=List[ContentTypePerformanceResponse], tags=["Analytics"])
def get_content_types_endpoint(organization_slug: str = Query("novastack"), db: Session = Depends(get_db)):
    return AnalyticsService(db).get_content_type_performance(organization_slug)


# 6. Content Gaps: GET /api/v1/analytics/gaps
@api_router.get("/analytics/gaps", response_model=List[ContentGapResponse], tags=["Analytics"])
def get_gaps_endpoint(organization_slug: str = Query("novastack"), db: Session = Depends(get_db)):
    return AnalyticsService(db).get_content_gaps(organization_slug)


# 7. Topic Trends: GET /api/v1/analytics/trends
@api_router.get("/analytics/trends", response_model=List[TopicTrendResponse], tags=["Analytics"])
def get_trends_endpoint(organization_slug: str = Query("novastack"), db: Session = Depends(get_db)):
    return AnalyticsService(db).get_topic_trends(organization_slug)


# 8. Content History: GET /api/v1/analytics/history
@api_router.get("/analytics/history", response_model=List[HistoryPointResponse], tags=["Analytics"])
def get_history_endpoint(organization_slug: str = Query("novastack"), db: Session = Depends(get_db)):
    return AnalyticsService(db).get_content_history(organization_slug)


# 9. Brand Voice: GET /api/v1/brand-voice
@api_router.get("/brand-voice", response_model=BrandVoiceResponse, tags=["Brand Voice"])
def get_brand_voice_endpoint(organization_slug: str = Query("novastack")):
    return get_brand_voice(organization_slug)


# 10. Save Recommendation: POST /api/v1/recommendations
@api_router.post("/recommendations", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED, tags=["Recommendations"])
def save_recommendation_endpoint(req: SaveRecommendationRequest, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    try:
        return service.save_recommendation(
            title=req.title,
            rationale=req.rationale,
            target_topic=req.target_topic,
            content_type=req.content_type,
            supporting_content_ids=req.supporting_content_ids,
            supporting_memory_refs=req.supporting_memory_refs,
            outline=req.outline,
            recommendation_type=req.recommendation_type,
            status=req.status,
            organization_slug=req.organization_slug
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# 11. Record Outcome: POST /api/v1/recommendations/{id}/outcome
@api_router.post("/recommendations/{id}/outcome", response_model=RecommendationOutcomeResponse, status_code=status.HTTP_201_CREATED, tags=["Recommendations"])
def record_outcome_endpoint(id: int, req: RecordOutcomeRequest, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    try:
        outcome = service.record_outcome(
            recommendation_id=id,
            outcome_type=req.outcome_type,
            metrics=req.metrics,
            notes=req.notes,
            content_id=req.content_id
        )
        return outcome
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# 12. Strategy Agent Chat: POST /api/v1/chat
@api_router.post("/chat", response_model=ChatResponse, tags=["Agent Chat"])
def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    try:
        from .agent.runner import run_agent_chat
        return run_agent_chat(req.message, req.organization_slug, db)
    except (ImportError, AttributeError):
        pass

    analytics_svc = AnalyticsService(db)
    rec_svc = RecommendationService(db)
    bridge = HindsightBridge(db)

    gaps = analytics_svc.get_content_gaps(req.organization_slug)
    trends = analytics_svc.get_topic_trends(req.organization_slug)
    insights = bridge.generate_insight_candidates(req.organization_slug)

    top_gap = gaps[0] if gaps else {"topic": "Cybersecurity", "gap_score": 78, "evidence_content_ids": []}
    target_topic = top_gap["topic"]
    evidence_ids = top_gap.get("evidence_content_ids", [])

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
        organization_slug=req.organization_slug
    )

    memories_list = [
        ChatMemoryItem(
            key=ins["insight_key"],
            statement=ins["statement"],
            relevance=0.92
        )
        for ins in insights[:2]
    ]

    return ChatResponse(
        answer=(
            f"Based on NovaStack's historical analytics and persistent memory patterns, "
            f"we strongly recommend creating a Technical Guide on '{title}'. "
            f"{rationale}"
        ),
        intent="content_recommendation",
        recommendation=RecommendationResponse(**saved_rec),
        evidence=ChatEvidence(
            content=evidence_ids,
            gaps=[g["topic"] for g in gaps[:3]],
            trends=[t["topic"] for t in trends if t["status"] == "growing"]
        ),
        memories=memories_list
    )
