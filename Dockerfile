# ─────────────────────────────────────────
# OfferGuard - Dockerfile
# ─────────────────────────────────────────

# Use official Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# ─────────────────────────────────────────
# Install system dependencies
# Tesseract → OCR
# Poppler  → pdf2image
# ─────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ─────────────────────────────────────────
# Install Python dependencies
# ─────────────────────────────────────────
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
# Copy backend code
# ─────────────────────────────────────────
COPY backend/ .

# ─────────────────────────────────────────
# Set Tesseract path (installed via apt)
# ─────────────────────────────────────────
ENV TESSERACT_PATH=/usr/bin/tesseract

# ─────────────────────────────────────────
# Expose port and start server
# ─────────────────────────────────────────
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]