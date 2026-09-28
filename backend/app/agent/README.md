# Team 1 Handoff Guide — AI Agent & Hindsight Integration

This directory (`backend/app/agent/`) is owned by **Team 1**.

Team 3 has created and verified the entire underlying data, analytics, bridge, and persistence layers. You do **not** need to touch database tables or raw SQL queries.

---

## 1. How to Import the Team 3 Service Layer

```python
from backend.app.service import AnalyticsService, get_brand_voice
from backend.app.database import SessionLocal

db = SessionLocal()
analytics = AnalyticsService(db)
```

---

## 2. Authoritative Team 1 Service Boundary Functions

All 11 functions are exposed directly on `AnalyticsService` and return clean, typed, serializable Python dictionaries:

1. `analytics.get_content_overview(organization_slug="novastack")`:
   Returns `{ total_content, average_engagement, total_views, top_topic, top_content_type, published_range: { start, end } }`

2. `analytics.get_top_topics(organization_slug="novastack", limit=5)`:
   Returns top topics ranked by average engagement rate:
   `[ { topic, content_count, average_engagement, normalized_score, median_views, best_content_type, last_published_date, evidence_content_ids } ]`

3. `analytics.get_low_performing_topics(organization_slug="novastack", limit=5)`:
   Returns lowest performing topics by engagement rate.

4. `analytics.get_content_type_performance(organization_slug="novastack")`:
   Returns format performance: `[ { content_type, count, average_engagement, average_views } ]`

5. `analytics.get_content_gaps(organization_slug="novastack")`:
   Returns ranked content gaps using the deterministic formula:
   $$\text{gap\_score} = 0.40 \times \text{underrepresentation} + 0.30 \times \text{staleness} + 0.30 \times \text{related\_topic\_performance}$$
   `[ { topic, gap_score, reason, factors: { underrepresentation, staleness, related_topic_performance }, evidence_content_ids } ]`

6. `analytics.get_topic_trends(organization_slug="novastack")`:
   Returns topic momentum evaluated over explicit 90-day windows:
   - **Recent period**: `[today - 90 days, today]`
   - **Prior period**: `[today - 180 days, today - 90 days)`
   `[ { topic, status: "growing" | "stable" | "declining" | "insufficient_data", recent_count, prior_count, change_pct } ]`

7. `analytics.get_brand_voice(organization_slug="novastack")`:
   Returns `{ tone: [...], preferred_words: [...], avoid_words: [...] }`

8. `analytics.get_content_history(organization_slug="novastack")`:
   Returns monthly publication timeline: `[ { period, content_count, average_engagement, views } ]`

9. `analytics.get_insight_candidates(organization_slug="novastack")`:
   Generates deterministic insight candidates formatted for Hindsight memory retention.

10. `analytics.save_recommendation(title, rationale, target_topic, content_type, supporting_content_ids, supporting_memory_refs, outline, organization_slug="novastack")`:
    Saves an agent recommendation into the database. Returns recommendation dict with generated `id`.

11. `analytics.record_outcome(recommendation_id, outcome_type, metrics, notes, content_id)`:
    Records user/performance outcome for a recommendation, completing the memory feedback loop.

---

## 3. Team 3 → Hindsight Bridge Contract

Team 3 produces deterministic, deduplicatable insight candidates. Team 1 retains them into Hindsight:

```
PostgreSQL → Deterministic Analytics → Insight Candidates → Team 1 → Hindsight.retain()
```

### Insight Candidate Schema
```json
{
  "insight_key": "performance:topic:ai_agents",
  "kind": "performance_pattern",
  "statement": "AI Agents content has historically performed strongly for NovaStack, averaging 8.6% engagement rate across 26 publications, with Technical Guide achieving peak engagement.",
  "evidence_content_ids": [12, 44, 71]
}
```

### Ingestion Hook Example
```python
candidates = analytics.get_insight_candidates("novastack")
for item in candidates:
    hindsight.retain(
        key=item["insight_key"],
        text=item["statement"],
        metadata={"evidence_content_ids": item["evidence_content_ids"]}
    )
```

### Outcome Feedback Hook Example
When a user records an outcome (e.g. published guide), record it and retain the outcome candidate:
```python
outcome = analytics.record_outcome(
    recommendation_id=saved_rec["id"],
    outcome_type="published",
    metrics={"views": 4200, "engagement_rate": 0.081},
    notes="Published technical guide. Outperformed historical average.",
    content_id=140
)

# Outcome candidate schema:
# {
#   "insight_key": "outcome:recommendation:7",
#   "kind": "recommendation_outcome",
#   "statement": "Strategy recommendation '...' was executed and published with 8.1% engagement and 4200 views.",
#   "evidence_content_ids": [140]
# }
outcome_candidate = analytics._bridge.generate_outcome_insight(outcome["id"])
hindsight.retain(
    key=outcome_candidate["insight_key"],
    text=outcome_candidate["statement"],
    metadata={"evidence_content_ids": outcome_candidate["evidence_content_ids"]}
)
```

---

## 4. Hooking Up `POST /api/v1/chat`

Define `run_agent_chat` in `backend/app/agent/runner.py`:

```python
def run_agent_chat(message: str, organization_slug: str, db):
    # 1. Recall from Hindsight
    # 2. Query AnalyticsService
    # 3. Call Groq with Brand Voice and Evidence
    # 4. Save recommendation via analytics.save_recommendation(...)
    # 5. Return dict matching ChatResponse schema
    ...
```

The router in `backend/app/routes.py` automatically detects `backend.app.agent.runner.run_agent_chat` and delegates to it.
