from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    JSON,
)
from sqlalchemy.orm import relationship
from .database import Base


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    industry = Column(String(100), nullable=True)
    website_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    # Relationships
    content_items = relationship("ContentItem", back_populates="organization", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="organization", cascade="all, delete-orphan")


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    organization_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("organizations.id"), nullable=False, index=True)
    source = Column(String(50), nullable=False)  # csv, rss, dev, etc.
    source_url = Column(String(1000), nullable=True)
    external_id = Column(String(255), nullable=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    body_text = Column(Text, nullable=True)
    content_type = Column(String(50), nullable=False, index=True)  # Blog, Tutorial, Technical Guide, etc.
    author = Column(String(255), nullable=True)
    published_at = Column(DateTime, nullable=False, index=True)
    language = Column(String(10), default="en", nullable=False)
    metric_source = Column(String(50), default="synthetic", nullable=False)
    source_confidence = Column(Float, default=1.0, nullable=False)
    content_hash = Column(String(64), nullable=True, index=True)
    metadata_ = Column("metadata", JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="content_items")
    performance_metrics = relationship("PerformanceMetric", back_populates="content_item", cascade="all, delete-orphan")
    content_topics = relationship("ContentTopic", back_populates="content_item", cascade="all, delete-orphan")
    outcomes = relationship("RecommendationOutcome", back_populates="content_item")


class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    content_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("content_items.id"), nullable=False, index=True)
    views = Column(BigInteger, nullable=True)
    likes = Column(BigInteger, nullable=True)
    comments = Column(BigInteger, nullable=True)
    shares = Column(BigInteger, nullable=True)
    clicks = Column(BigInteger, nullable=True)
    conversions = Column(BigInteger, nullable=True)
    engagement_rate = Column(Float, nullable=True, index=True)
    metric_source = Column(String(50), default="synthetic", nullable=False)
    observed_at = Column(DateTime, default=utcnow, nullable=False)
    metadata_ = Column("metadata", JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    # Relationships
    content_item = relationship("ContentItem", back_populates="performance_metrics")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    # Relationships
    content_topics = relationship("ContentTopic", back_populates="topic", cascade="all, delete-orphan")


class ContentTopic(Base):
    __tablename__ = "content_topics"

    content_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("content_items.id"), primary_key=True)
    topic_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("topics.id"), primary_key=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    assigned_by = Column(String(50), default="rule", nullable=False)

    # Relationships
    content_item = relationship("ContentItem", back_populates="content_topics")
    topic = relationship("Topic", back_populates="content_topics")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    organization_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("organizations.id"), nullable=False, index=True)
    recommendation_type = Column(String(50), default="content_creation", nullable=False)
    title = Column(String(500), nullable=False)
    rationale = Column(Text, nullable=False)
    target_topic = Column(String(100), nullable=False)
    content_type = Column(String(50), nullable=False)
    supporting_content_ids = Column(JSON, default=list, nullable=False)
    supporting_memory_refs = Column(JSON, default=list, nullable=False)
    outline = Column(JSON, default=list, nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, accepted, rejected, published
    created_at = Column(DateTime, default=utcnow, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="recommendations")
    outcomes = relationship("RecommendationOutcome", back_populates="recommendation", cascade="all, delete-orphan")


class RecommendationOutcome(Base):
    __tablename__ = "recommendation_outcomes"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    recommendation_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("recommendations.id"), nullable=False, index=True)
    content_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("content_items.id"), nullable=True, index=True)
    outcome_type = Column(String(50), nullable=False)  # accepted, rejected, published, reviewed
    metrics = Column(JSON, default=dict, nullable=False)
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=utcnow, nullable=False)

    # Relationships
    recommendation = relationship("Recommendation", back_populates="outcomes")
    content_item = relationship("ContentItem", back_populates="outcomes")
