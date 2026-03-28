# ml_service/app/main.py

import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.predict import router
from app.services.model_loader import ensure_model_exists

load_dotenv()

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
<<<<<<< HEAD
    logger.info("🚀 ML Service starting up...")
    # Download model if not present
    ensure_model_exists()
    yield
    logger.info("🛑 ML Service shutting down...")
=======
    logger.info("Sign Language ML Service starting...")
    yield
    logger.info("Sign Language ML Service shutting down...")
>>>>>>> e5e78c73acb617f575896bf2af5fa8203128bb82

app = FastAPI(
    title="Sign Language ML Service",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update after deployment
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Routes
app.include_router(router)


# Root
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "Sign Language ML Service",
        "version": "1.0.0",
        "endpoints": {
            "file_upload": "POST /predict",
            "base64":      "POST /predict/base64",
            "health":      "GET  /health",
            "docs":        "GET  /docs",
        }
    }