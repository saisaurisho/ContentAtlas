from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


# --- Content Schemas ---
class ContentMetricsSchema(BaseModel):
    views: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    clicks: Optional[int] = None
    conversions: Optional[int] = None
    engagement_rate: Optional[float] = None


class ContentItemResponse(BaseModel):
    id: int
    title: str
    content_type: str
    author: Optional[str] = None
    published_at: datetime
    topics: List[str] = []
    metrics: Optional[ContentMetricsSchema] = None

    class Config:
        from_attributes = True


class ContentListResponse(BaseModel):
    total: int
    items: List[ContentItemResponse]


# --- Analytics Schemas ---
class PublishedRange(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None


class ContentOverviewResponse(BaseModel):
    total_content: int
    average_engagement: Optional[float] = None
    total_views: int
    top_topic: Optional[str] = None
    top_content_type: Optional[str] = None
    published_range: PublishedRange


class TopicPerformanceResponse(BaseModel):
    topic: str
    content_count: int
    average_engagement: Optional[float] = None
    normalized_score: float
    median_views: Optional[int] = None
    best_content_type: Optional[str] = None
    last_published_date: Optional[str] = None
    evidence_content_ids: List[int] = []


class ContentTypePerformanceResponse(BaseModel):
    content_type: str
    count: int
    average_engagement: Optional[float] = None
    average_views: Optional[int] = None


class GapFactors(BaseModel):
    underrepresentation: float
    staleness: float
    related_topic_performance: float


class ContentGapResponse(BaseModel):
    topic: str
    gap_score: float
    reason: str
    factors: GapFactors
    evidence_content_ids: List[int] = []


class TopicTrendResponse(BaseModel):
    topic: str
    status: str  # growing, stable, declining, insufficient_data
    recent_count: int
    prior_count: int
    change_pct: Optional[float] = None


class HistoryPointResponse(BaseModel):
    period: str
    content_count: int
    average_engagement: Optional[float] = None
    views: int


# --- Brand Voice Schema ---
class BrandVoiceResponse(BaseModel):
    tone: List[str]
    preferred_words: List[str]
    avoid_words: List[str]


# --- Recommendation & Outcome Schemas ---
class SaveRecommendationRequest(BaseModel):
    organization_slug: str = "novastack"
    recommendation_type: str = "content_creation"
    title: str
    rationale: str
    target_topic: str
    content_type: str
    supporting_content_ids: List[int] = []
    supporting_memory_refs: List[str] = []
    outline: List[str] = []
    status: str = "pending"


class RecommendationResponse(BaseModel):
    id: int
    organization_id: int
    recommendation_type: str
    title: str
    rationale: str
    target_topic: str
    content_type: str
    supporting_content_ids: List[int]
    supporting_memory_refs: List[str]
    outline: List[str]
    status: str
    created_at: str


class RecordOutcomeRequest(BaseModel):
    content_id: Optional[int] = None
    outcome_type: str  # published, accepted, rejected, etc.
    metrics: Dict[str, Any] = {}
    notes: Optional[str] = None


class RecommendationOutcomeResponse(BaseModel):
    id: int
    recommendation_id: int
    content_id: Optional[int] = None
    outcome_type: str
    metrics: Dict[str, Any]
    notes: Optional[str] = None
    recorded_at: str


# --- Chat Schemas ---
class ChatRequest(BaseModel):
    message: str
    organization_slug: str = "novastack"


class ChatEvidence(BaseModel):
    content: List[int] = []
    gaps: List[str] = []
    trends: List[str] = []


class ChatMemoryItem(BaseModel):
    key: str
    statement: str
    relevance: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    intent: str = "content_recommendation"
    recommendation: Optional[RecommendationResponse] = None
    evidence: ChatEvidence
    memories: List[ChatMemoryItem] = []


# --- Memory API Schemas (Used by Frontend Memory Hub) ---
class MemoryRetainRequest(BaseModel):
    content: str
    memoryType: str = "user_retained"
    source: str = "manual_input"


class MemoryItemSchema(BaseModel):
    id: str
    memoryType: str
    content: str
    source: str
    timestamp: Optional[str] = None


class MemoryRecallRequest(BaseModel):
    query: str
    limit: int = 5


class MemoryRecallResponse(BaseModel):
    memories: List[MemoryItemSchema]
    query: str
