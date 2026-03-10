# ─────────────────────────────────────────
# OfferGuard - Dockerfile (Render)
# ─────────────────────────────────────────

FROM python:3.11-slim

# ─────────────────────────────────────────
# Install system dependencies
# ─────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    gcc \
    g++ \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─────────────────────────────────────────
# Install Python dependencies
# ─────────────────────────────────────────
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
# Copy backend code
# ─────────────────────────────────────────
COPY backend/ .

# ─────────────────────────────────────────
# Set Tesseract path
# ─────────────────────────────────────────
ENV TESSERACT_PATH=/usr/bin/tesseract

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]