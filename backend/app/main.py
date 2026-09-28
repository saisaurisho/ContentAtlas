from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, API_V1_PREFIX, PROJECT_NAME, VERSION
from .models import (  # Ensures all 7 models are registered with Base metadata
    Organization,
    ContentItem,
    PerformanceMetric,
    Topic,
    ContentTopic,
    Recommendation,
    RecommendationOutcome,
)
from .routes import health_router, api_router

# Initialize database tables on application start
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="Content Strategy Agent - P0 Data & Analytics Engine"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint at root
app.include_router(health_router)

# API v1 prefix
app.include_router(api_router, prefix=API_V1_PREFIX)


@app.get("/")
def root():
    return {
        "service": PROJECT_NAME,
        "version": VERSION,
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
