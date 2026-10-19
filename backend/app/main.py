import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, UPLOAD_DIR
from .database import engine, Base, SessionLocal
from .seed_data import seed_database

from .routers import (
    employees,
    documents,
    vacancies,
    promotions,
    audit,
    inquiries,
    stats
)

# Initialize tables and seed on module load
Base.metadata.create_all(bind=engine)
_db = SessionLocal()
try:
    seed_database(_db)
finally:
    _db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure startup readiness
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title="FairGov AI — Government Employee Records & Promotion Management System",
    description=(
        "Production-prototype REST API for auditable government employee records, "
        "document integrity verification, annual vacancy reconciliation, explainable candidate ranking, "
        "and manipulation-detection audit trails. Uses synthetic demonstration data."
    ),
    version="1.0.0-pilot",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for local dev and demo UI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(stats.router)
app.include_router(employees.router)
app.include_router(documents.router)
app.include_router(vacancies.router)
app.include_router(promotions.router)
app.include_router(audit.router)
app.include_router(inquiries.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FairGov AI Government Platform",
        "mode": "DEMONSTRATION_PILOT",
        "synthetic_data": True,
        "tamper_safeguard_active": True
    }
