# ContentAtlas — Autonomous AI Content Strategy Agent with Long-Term Memory

ContentAtlas is a memory-augmented editorial intelligence platform that transforms raw publication metrics and audience signals into high-impact, evidence-grounded content strategies. 

Unlike stateless LLM workflows or naive retrieval-augmented generation (RAG) that simply regurgitate raw text, ContentAtlas combines **deterministic relational analytics** with **persistent episodic memory** powered by [Vectorize Hindsight](https://github.com/vectorize-io/hindsight). It forms a closed feedback loop: past performance informs current recommendations, and real-world publication outcomes permanently update the agent's institutional knowledge.

```
Historical Content & Metrics
        │
        ▼
Deterministic Analytics & Gap Engine (PostgreSQL / SQLAlchemy)
        │
        ▼
Hindsight Bridge (Insight Candidate Distillation)
        │
        ▼
Hindsight Memory Engine (Retain / Semantic Recall)
        │
        ▼
Strategy Agent (Groq / Llama 3.3 / GPT-OSS Reasoning)
        │
        ▼
Actionable Editorial Recommendations & Outlines
        │
        ▼
Recommendation Outcomes (Views, Engagement, Conversion Tracking)
        │
        └─────────────────► Closed-Loop Memory Retention
```

---

## Key Architecture & Components

ContentAtlas decouples statistical fact from generative reasoning across four modular layers:

1. **Frontend Web Dashboard (`frontend/`)**:
   - Modern, responsive UI built with Next.js 16, React 19, Tailwind CSS, and Recharts.
   - Interactive chat window with real-time intent classification, evidence linking, and outline rendering.
   - Live Memory Management Hub for searching, inspecting, and retaining institutional memory.
   - Comparative Before-vs-After demonstration of stateless prompting vs. memory-augmented recall.

2. **Backend API & Service Layer (`backend/app/`)**:
   - High-throughput asynchronous REST API built with FastAPI and Pydantic v2.
   - Clean service abstraction (`AnalyticsService`) isolating business logic from direct database queries.
   - Authoritative OpenAPI 3.0 contract (`contracts/openapi.yaml`) covering content, analytics, recommendations, memory, and chat.

3. **Deterministic Analytics & Content Gap Engine (`backend/app/analytics.py`, `backend/app/gaps.py`)**:
   - Guarded engagement rate calculation preventing division-by-zero on unobserved metrics.
   - Rolling momentum tracking over 90-day time-series windows (`[today-90d, today]` vs `[today-180d, today-90d)`).
   - Multi-factor deterministic gap scoring:
     $$\text{gap\_score} = 0.40 \times \text{underrepresentation} + 0.30 \times \text{staleness} + 0.30 \times \text{related\_topic\_affinity}$$

4. **Persistent Memory & Agent Reasoning (`backend/app/agent/`, `hindsight-client`, `groq`)**:
   - Hindsight Bridge translates relational database metrics into semantic, deduplicatable insight candidates.
   - Episodic memory retention and semantic recall with retry and exponential backoff.
   - Groq inference (`openai/gpt-oss-120b` or `llama-3.3-70b-versatile`) operating on verified brand voice guidelines and recalled organizational memories.

---

## Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| **Backend API** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL 16 (production), SQLite 3 (local zero-dependency mode), SQLAlchemy 2.0 |
| **Memory Engine** | Vectorize Hindsight Cloud & Local SDK (`hindsight-client`) |
| **LLM Inference** | Groq Cloud SDK (`groq`), `openai/gpt-oss-120b` / `llama-3.3-70b-versatile` |
| **Data Ingestion** | Pandas, Canonical CSV Ingestion Pipeline, Idempotent Content Hash Deduping |

---

## Quickstart Guide

### 1. Prerequisites & Dependencies
Clone the repository and install backend and frontend packages:

```bash
# Install Python backend dependencies
pip install -r backend/requirements.txt

# Install Next.js frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables
Copy the template configuration file:

```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# Database (defaults to local SQLite if left unchanged)
DATABASE_URL=sqlite:///./content_atlas.db

# Groq LLM Inference
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

# Hindsight Cloud Memory
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=content-strategy-main-v3
```

---

### 3. Automated Pipeline Verification & Seeding
Verify all database tables, cloud memory connections, Groq inference, and agent reasoning in one automated command:

```bash
python scripts/run_pipeline.py
```

This single command:
- Initializes the database schema and loads 111 canonical historical content items.
- Computes baseline analytics, topic trends, and content gaps.
- Tests connectivity to Hindsight Cloud and verifies bank memories.
- Verifies Groq LLM execution.
- Generates a sample live strategy recommendation.

---

### 4. Running the Application

#### Start the Backend API (Terminal 1)
From the project root directory:

```bash
uvicorn backend.app.main:app --reload --port 8000
```
- **API Server**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

#### Start the Frontend Dashboard (Terminal 2)
In a separate terminal window:

```bash
cd frontend
npm run dev
```
- **Web Application**: [http://localhost:3000](http://localhost:3000)

---

### 5. Interactive CLI Strategy Agent
To interact with the strategy agent directly in your terminal without a browser:

```bash
python scripts/agent_chat.py
```

---

## API Surface

ContentAtlas exposes 14 authoritative REST endpoints matching OpenAPI 3.0:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health and database connectivity check |
| `GET` | `/api/v1/content` | Filterable list of published content items with metrics |
| `GET` | `/api/v1/analytics/overview` | High-level metrics: total pieces, views, avg engagement, top topic |
| `GET` | `/api/v1/analytics/top-topics` | Ranked topics by historical engagement rate |
| `GET` | `/api/v1/analytics/content-types` | Format performance breakdown (Tutorial vs Guide vs Blog) |
| `GET` | `/api/v1/analytics/gaps` | Ranked content gaps computed via multi-factor gap formula |
| `GET` | `/api/v1/analytics/trends` | 90-day topic velocity (growing, stable, declining) |
| `GET` | `/api/v1/analytics/history` | Longitudinal monthly volume and engagement time-series |
| `GET` | `/api/v1/brand-voice` | Structured tone guardrails, preferred terminology, and avoid-words |
| `POST` | `/api/v1/recommendations` | Save strategy recommendations to database |
| `POST` | `/api/v1/recommendations/{id}/outcome` | Record publication outcomes (views, engagement) to close feedback loop |
| `POST` | `/api/v1/chat` | Main strategy agent endpoint with Hindsight recall + Groq reasoning |
| `POST` | `/api/v1/memory/retain` | Retain new semantic memory directly into Hindsight |
| `POST` | `/api/v1/memory/recall` | Query and recall institutional memories from Hindsight |

---

## Repository Structure

```
ContentAtlas/
├── backend/
│   ├── app/
│   │   ├── agent/             # Hindsight + Groq agent runner and prompt loops
│   │   ├── analytics.py       # Pure Python/SQL deterministic metric aggregation
│   │   ├── database.py        # SQLAlchemy session & multi-database engine setup
│   │   ├── gaps.py            # Deterministic gap scoring algorithm
│   │   ├── ingestion.py       # Canonical CSV adapter and idempotent content hash loader
│   │   ├── main.py            # FastAPI application factory and CORS middleware
│   │   ├── models.py          # 7 SQLAlchemy models (Organizations, Content, Metrics, Topics, etc.)
│   │   ├── routes.py          # 14 REST endpoints
│   │   ├── schemas.py         # Pydantic v2 validation contracts
│   │   ├── service.py         # Service layer & HindsightBridge candidate extractor
│   │   └── trends.py          # Rolling 90-day window topic momentum engine
│   ├── requirements.txt       # Backend Python dependencies
│   └── tests/                 # 22 automated unit and integration tests
├── contracts/
│   └── openapi.yaml           # OpenAPI 3.0 specification
├── data/
│   └── seed/                  # Seed dataset for NovaStack organization (111 records)
├── frontend/
│   ├── app/                   # Next.js 16 App Router pages (/dashboard, /chat, /memory, etc.)
│   ├── components/            # React components (ChatWindow, MemoryPanel, Charts, Cards)
│   ├── lib/                   # API client, TypeScript definitions, and normalization layer
│   └── package.json           # Frontend dependencies
├── scripts/
│   ├── agent_chat.py          # Standalone interactive CLI strategy agent
│   ├── demo_reset.py          # Clean slate database reset script
│   ├── generate_dataset.py    # Synthetic dataset generator with realistic distributions
│   ├── init_memory.py         # Retain analytics insights into Hindsight Cloud
│   ├── run_pipeline.py        # End-to-end pipeline verification and diagnostic test
│   ├── seed_database.py       # Database schema creation and CSV ingestion
│   ├── test_groq.py           # Standalone Groq connectivity test
│   └── test_hindsight_cloud.py# Standalone Hindsight Cloud connectivity test
├── .env.example               # Environment variable template
├── article.md                 # Technical in-depth architectural article
└── README.md                  # Project documentation
```

---

## Testing & Quality Assurance

Run the comprehensive unit test suite:

```bash
python -m unittest discover backend/tests
```

Run frontend static analysis and production build:

```bash
cd frontend
npm run lint
npm run build
```

---

## License

This project is licensed under the MIT License.
