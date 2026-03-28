# ml_service/app/services/model_loader.py

import os
import logging
import requests

logger = logging.getLogger(__name__)

MODEL_PATH = os.getenv("MODEL_PATH", "sign_language_interpreter_model.h5")
MODEL_URL  = os.getenv("MODEL_URL", "")

def ensure_model_exists():
    """
    Downloads model from URL if not present locally.
    Set MODEL_URL env var to your model's direct download link.
    """
    if os.path.exists(MODEL_PATH):
        logger.info(f"✅ Model already exists at {MODEL_PATH}")
        return True

    if not MODEL_URL:
        logger.error(
            "❌ Model file not found and MODEL_URL is not set.\n"
            "   Set MODEL_URL env var to a direct download link."
        )
        return False

    try:
        logger.info(f"⬇️  Downloading model from {MODEL_URL}...")
        response = requests.get(MODEL_URL, stream=True, timeout=300)
        response.raise_for_status()

        total = int(response.headers.get("content-length", 0))
        downloaded = 0

        with open(MODEL_PATH, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = (downloaded / total) * 100
                    if downloaded % (1024 * 1024 * 10) < 8192:
                        logger.info(f"   {pct:.1f}% downloaded...")

        logger.info(f"✅ Model downloaded successfully to {MODEL_PATH}")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to download model: {e}")
        return False