import csv
import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Dict, Any, Literal, Union
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from .models import (
    Organization,
    Topic,
    ContentItem,
    PerformanceMetric,
    ContentTopic
)


class IngestionMetrics(BaseModel):
    views: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    clicks: Optional[int] = None
    conversions: Optional[int] = None
    engagement_rate: Optional[float] = None
    observed_at: Optional[datetime] = None


class ContentRecord(BaseModel):
    """Canonical data model for all content ingestion sources."""
    kind: Literal["owned_content", "trend_signal"] = "owned_content"
    organization_slug: str = "novastack"
    source: str = "csv"
    external_id: Optional[str] = None
    source_url: Optional[str] = None
    title: str
    description: Optional[str] = None
    body_text: Optional[str] = None
    content_type: str
    author: Optional[str] = None
    published_at: datetime
    language: str = "en"
    topics_raw: List[str] = Field(default_factory=list)
    metrics: Optional[IngestionMetrics] = None
    metric_source: str = "synthetic"
    source_confidence: float = 1.0
    fetched_at: Optional[datetime] = None
    extra: Dict[str, Any] = Field(default_factory=dict)
    content_hash: Optional[str] = None


def parse_datetime(val: str) -> datetime:
    if not val:
        return datetime.now(timezone.utc).replace(tzinfo=None)
    val = val.strip()
    try:
        return datetime.fromisoformat(val.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError:
        pass
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(val, fmt)
        except ValueError:
            continue
    return datetime.now(timezone.utc).replace(tzinfo=None)


def calculate_hash(title: str, body_text: str = "") -> str:
    content = f"{title.strip().lower()}|{(body_text or '').strip().lower()}"
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


class CSVAdapter:
    """Adapter to parse CSV files into canonical ContentRecord objects."""

    @staticmethod
    def load(file_path: Union[str, Path], organization_slug: str = "novastack") -> List[ContentRecord]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"CSV file not found: {path}")

        records: List[ContentRecord] = []
        with open(path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_topics_str = row.get("topics") or row.get("topics_raw") or ""
                if ";" in raw_topics_str:
                    topics = [t.strip() for t in raw_topics_str.split(";") if t.strip()]
                else:
                    topics = [t.strip() for t in raw_topics_str.split(",") if t.strip()]

                views = int(row["views"]) if row.get("views") and row["views"].strip() else None
                likes = int(row["likes"]) if row.get("likes") and row["likes"].strip() else 0
                comments = int(row["comments"]) if row.get("comments") and row["comments"].strip() else 0
                shares = int(row["shares"]) if row.get("shares") and row["shares"].strip() else 0
                clicks = int(row["clicks"]) if row.get("clicks") and row["clicks"].strip() else None
                conversions = int(row["conversions"]) if row.get("conversions") and row["conversions"].strip() else None

                if views is not None and views > 0:
                    engagement_rate = round(float((likes + comments + shares) / views), 5)
                else:
                    engagement_rate = None

                metric_source = row.get("metric_source", "synthetic") or "synthetic"
                observed_str = row.get("observed_at")
                observed_at = parse_datetime(observed_str) if observed_str else datetime.now(timezone.utc).replace(tzinfo=None)

                metrics_obj = IngestionMetrics(
                    views=views,
                    likes=likes,
                    comments=comments,
                    shares=shares,
                    clicks=clicks,
                    conversions=conversions,
                    engagement_rate=engagement_rate,
                    observed_at=observed_at
                )

                title = row.get("title", "").strip()
                body_text = row.get("body_text", "").strip()
                c_hash = row.get("content_hash") or calculate_hash(title, body_text)

                record = ContentRecord(
                    kind="owned_content",
                    organization_slug=organization_slug,
                    source=row.get("source", "csv") or "csv",
                    external_id=row.get("external_id") or None,
                    source_url=row.get("source_url") or None,
                    title=title,
                    description=row.get("description") or None,
                    body_text=body_text or None,
                    content_type=row.get("content_type", "Blog").strip(),
                    author=row.get("author") or "NovaStack Engineering",
                    published_at=parse_datetime(row.get("published_at", "")),
                    language=row.get("language", "en") or "en",
                    topics_raw=topics,
                    metrics=metrics_obj,
                    metric_source=metric_source,
                    source_confidence=float(row.get("source_confidence", 1.0) or 1.0),
                    fetched_at=datetime.now(timezone.utc).replace(tzinfo=None),
                    extra={},
                    content_hash=c_hash
                )
                records.append(record)

        return records


class IngestionService:
    """Service to persist canonical ContentRecord items into the database."""

    def __init__(self, db: Session):
        self.db = db

    def get_or_create_organization(self, slug: str, name: str = None) -> Organization:
        org = self.db.query(Organization).filter(Organization.slug == slug).first()
        if not org:
            org = Organization(
                name=name or slug.capitalize(),
                slug=slug,
                industry="Developer Infrastructure & AI",
                website_url=f"https://{slug}.dev"
            )
            self.db.add(org)
            self.db.commit()
            self.db.refresh(org)
        return org

    def get_or_create_topic(self, topic_name: str) -> Topic:
        slug = slugify(topic_name)
        topic = self.db.query(Topic).filter((Topic.slug == slug) | (Topic.name == topic_name)).first()
        if not topic:
            topic = Topic(
                name=topic_name.strip(),
                slug=slug,
                description=f"Articles and insights related to {topic_name}"
            )
            self.db.add(topic)
            self.db.commit()
            self.db.refresh(topic)
        return topic

    def ingest_records(self, records: List[ContentRecord]) -> int:
        ingested_count = 0
        if not records:
            return 0

        org_cache = {}
        topic_cache = {}

        for rec in records:
            if rec.organization_slug not in org_cache:
                org_cache[rec.organization_slug] = self.get_or_create_organization(rec.organization_slug)
            org = org_cache[rec.organization_slug]

            existing_item = None
            if rec.external_id:
                existing_item = self.db.query(ContentItem).filter(
                    ContentItem.organization_id == org.id,
                    ContentItem.external_id == rec.external_id
                ).first()
            if not existing_item and rec.content_hash:
                existing_item = self.db.query(ContentItem).filter(
                    ContentItem.organization_id == org.id,
                    ContentItem.content_hash == rec.content_hash
                ).first()

            if existing_item:
                if rec.metrics:
                    metric = self.db.query(PerformanceMetric).filter(
                        PerformanceMetric.content_id == existing_item.id
                    ).first()
                    if metric:
                        metric.views = rec.metrics.views
                        metric.likes = rec.metrics.likes
                        metric.comments = rec.metrics.comments
                        metric.shares = rec.metrics.shares
                        metric.clicks = rec.metrics.clicks
                        metric.conversions = rec.metrics.conversions
                        metric.engagement_rate = rec.metrics.engagement_rate
                        metric.observed_at = rec.metrics.observed_at
                    else:
                        new_metric = PerformanceMetric(
                            content_id=existing_item.id,
                            views=rec.metrics.views,
                            likes=rec.metrics.likes,
                            comments=rec.metrics.comments,
                            shares=rec.metrics.shares,
                            clicks=rec.metrics.clicks,
                            conversions=rec.metrics.conversions,
                            engagement_rate=rec.metrics.engagement_rate,
                            metric_source=rec.metric_source,
                            observed_at=rec.metrics.observed_at
                        )
                        self.db.add(new_metric)
                continue

            new_item = ContentItem(
                organization_id=org.id,
                source=rec.source,
                source_url=rec.source_url,
                external_id=rec.external_id,
                title=rec.title,
                description=rec.description,
                body_text=rec.body_text,
                content_type=rec.content_type,
                author=rec.author,
                published_at=rec.published_at,
                language=rec.language,
                metric_source=rec.metric_source,
                source_confidence=rec.source_confidence,
                content_hash=rec.content_hash,
                metadata_=rec.extra
            )
            self.db.add(new_item)
            self.db.flush()

            if rec.metrics:
                perf = PerformanceMetric(
                    content_id=new_item.id,
                    views=rec.metrics.views,
                    likes=rec.metrics.likes,
                    comments=rec.metrics.comments,
                    shares=rec.metrics.shares,
                    clicks=rec.metrics.clicks,
                    conversions=rec.metrics.conversions,
                    engagement_rate=rec.metrics.engagement_rate,
                    metric_source=rec.metric_source,
                    observed_at=rec.metrics.observed_at
                )
                self.db.add(perf)

            for idx, raw_t in enumerate(rec.topics_raw):
                clean_name = raw_t.strip()
                if not clean_name:
                    continue
                if clean_name not in topic_cache:
                    topic_cache[clean_name] = self.get_or_create_topic(clean_name)
                t_obj = topic_cache[clean_name]

                ct = ContentTopic(
                    content_id=new_item.id,
                    topic_id=t_obj.id,
                    is_primary=(idx == 0),
                    assigned_by="csv_ingestion"
                )
                self.db.add(ct)

            ingested_count += 1

        self.db.commit()
        return ingested_count
