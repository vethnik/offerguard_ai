# ─────────────────────────────────────────
# OfferGuard - Dockerfile (Hugging Face)
# ─────────────────────────────────────────

FROM python:3.11-slim

# ─────────────────────────────────────────
# Install system dependencies (as root)
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
# Required by Hugging Face Spaces
# ─────────────────────────────────────────
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set working directory
WORKDIR /home/user/app

# ─────────────────────────────────────────
# Install Python dependencies
# ─────────────────────────────────────────
COPY --chown=user backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
# Copy backend code
# ─────────────────────────────────────────
COPY --chown=user backend/ .

# ─────────────────────────────────────────
# Set Tesseract path
# ─────────────────────────────────────────
ENV TESSERACT_PATH=/usr/bin/tesseract

# ─────────────────────────────────────────
# Hugging Face uses port 7860
# ─────────────────────────────────────────
EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]