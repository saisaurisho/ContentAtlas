import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.database import engine, Base, SessionLocal
from backend.app.models import Organization, Topic, ContentItem, PerformanceMetric
from backend.app.ingestion import CSVAdapter, IngestionService
from backend.app.service import AnalyticsService
from scripts.generate_dataset import generate_novastack_dataset


def seed_database():
    print("=" * 60)
    print("ContentAtlas — Database Seed & Ingestion")
    print("=" * 60)

    # 1. Initialize DB schema
    Base.metadata.create_all(bind=engine)
    print(" [OK] Database schema verified.")

    # 2. Check/Generate dataset
    seed_csv = root_dir / "data" / "seed" / "novastack_content.csv"
    if not seed_csv.exists():
        print(f" [*] Generating seed dataset at {seed_csv}...")
        generate_novastack_dataset(str(seed_csv), seed=42)
    else:
        print(f" [OK] Seed dataset found at {seed_csv}")

    # 3. Ingest canonical records
    records = CSVAdapter.load(seed_csv, organization_slug="novastack")
    print(f" [OK] Loaded {len(records)} canonical records from CSV.")

    db = SessionLocal()
    try:
        service = IngestionService(db)
        ingested = service.ingest_records(records)
        print(f" [OK] Ingestion complete. Ingested {ingested} new content items.")

        # 4. Verification and Summary
        org_count = db.query(Organization).count()
        topic_count = db.query(Topic).count()
        item_count = db.query(ContentItem).count()
        metric_count = db.query(PerformanceMetric).count()

        print("-" * 60)
        print(" Database Counts:")
        print(f"  Organizations:       {org_count}")
        print(f"  Topics:              {topic_count}")
        print(f"  Content Items:       {item_count}")
        print(f"  Performance Metrics: {metric_count}")
        print("-" * 60)

        analytics = AnalyticsService(db)
        overview = analytics.get_overview("novastack")
        print(" Content Overview:")
        print(f"  Total Content:       {overview['total_content']}")
        print(f"  Avg Engagement Rate: {overview['average_engagement']}")
        print(f"  Total Views:         {overview['total_views']}")
        print(f"  Top Topic:           {overview['top_topic']}")
        print(f"  Top Format:          {overview['top_content_type']}")

        top_topics = analytics.get_top_topics("novastack", limit=3)
        print("\n Top 3 Topics:")
        for t in top_topics:
            print(f"   - {t['topic']}: {t['average_engagement']*100:.1f}% avg engagement ({t['content_count']} items)")

        gaps = analytics.get_content_gaps("novastack")
        print("\n Top 2 Content Gaps:")
        for g in gaps[:2]:
            print(f"   - {g['topic']} (Gap Score: {g['gap_score']}/100): {g['reason']}")

        print("=" * 60)
        print(" Seed completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
