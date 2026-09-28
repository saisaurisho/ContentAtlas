# ContentAtlas — AI Content Strategy Agent

Memory-augmented AI Content Strategy Agent built for the 1-day hackathon.

```
Historical Content
→ Structured Analytics
→ Hindsight Memory
→ LLM Reasoning
→ Content Strategy Recommendation
→ Recommendation Outcome
→ New Memory
→ Better Future Recommendations
```

---

## Architecture & Technology Stack

- **Frontend (Team 2)**: Next.js, React, Tailwind CSS, Recharts
- **Backend & APIs (Team 3)**: Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn
- **Database (Team 3)**: PostgreSQL (with local SQLite zero-dependency mode)
- **Analytics & Gap Engine (Team 3)**: Pure Python deterministic analytics, formula-based gap engine
- **Agent & Memory (Team 1)**: Hindsight Python SDK, Groq API (Llama 3.3 70B)

---

## Team 3 Artifacts & Boundaries

Team 3 has implemented:
- **P0 Database**: 7 core tables (`organizations`, `content_items`, `performance_metrics`, `topics`, `content_topics`, `recommendations`, `recommendation_outcomes`)
- **Canonical Model & CSV Ingestion**: `ContentRecord` canonical specification and idempotent CSV ingestion
- **Deterministic Synthetic Dataset**: 111 records for **NovaStack** across 12 months with discoverable patterns (AI Agents top, Generic topics low, Cybersecurity/FinTech gaps)
- **Deterministic Analytics Engine**:
  - `calculate_engagement_rate()` (handles zero/null views safely without fabricating zeroes)
  - `get_content_overview()`
  - `get_top_topics()` & `get_low_performing_topics()`
  - `get_content_type_performance()`
  - `get_content_gaps()`: `gap_score = 0.40 * underrep + 0.30 * staleness + 0.30 * related_perf`
  - `get_topic_trends()`: momentum evaluated on explicit windows (Recent: `[today-90d, today]`, Prior: `[today-180d, today-90d)`)
  - `get_content_history()`
- **Team 3 → Team 1 Service Layer**: Clean `AnalyticsService` isolating Team 1 from SQL tables (exposing all 11 required service boundary methods)
- **Team 3 → Hindsight Bridge**: Automatic translation of PostgreSQL analytics and recommendation outcomes into memory insight candidates
- **P0 API Contracts**: Exactly 12 authoritative endpoints matching OpenAPI 3.0 specification (`contracts/openapi.yaml`):
  1. `GET /health`
  2. `GET /api/v1/content`
  3. `GET /api/v1/analytics/overview`
  4. `GET /api/v1/analytics/top-topics`
  5. `GET /api/v1/analytics/content-types`
  6. `GET /api/v1/analytics/gaps`
  7. `GET /api/v1/analytics/trends`
  8. `GET /api/v1/analytics/history`
  9. `GET /api/v1/brand-voice`
  10. `POST /api/v1/recommendations`
  11. `POST /api/v1/recommendations/{id}/outcome`
  12. `POST /api/v1/chat`
- **Seed & Reset Scripts**: `scripts/seed_database.py` and `scripts/demo_reset.py`

---

## Quickstart

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Configure Environment
```bash
copy .env.example .env
```

### 3. Seed Database
```bash
python scripts/seed_database.py
```

### 4. Run Test Suite
```bash
python -m unittest discover backend/tests
```

### 5. Start Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```

- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)
- OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## Re-running Demo Reset
To clear all data and re-initialize a fresh demo state:
```bash
python scripts/demo_reset.py
```
