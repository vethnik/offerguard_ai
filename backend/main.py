from fastapi import FastAPI, UploadFile, File,Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import fitz
import re
import os
import joblib
import pytesseract

from pdf2image import convert_from_bytes

# ---------------------------------------------------
# App initialization
# ---------------------------------------------------

app = FastAPI()

# Allow all origins (since frontend + backend same server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Serve React frontend
# ---------------------------------------------------

app.mount("/assets", StaticFiles(directory="static/dist/assets"), name="assets")


@app.get("/")
async def serve_frontend():
    return FileResponse("static/dist/index.html")


# ---------------------------------------------------
# Tesseract path
# ---------------------------------------------------

pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_PATH")

# ---------------------------------------------------
# Load ML model
# ---------------------------------------------------

MODEL_PATH = os.path.join("ml", "fraud_model.pkl")
VECTORIZER_PATH = os.path.join("ml", "vectorizer.pkl")

ml_model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# ---------------------------------------------------
# Suspicious keywords
# ---------------------------------------------------

SUSPICIOUS_WORDS = [
    "processing fee",
    "registration fee",
    "urgent payment",
    "non-refundable",
    "limited slots",
    "immediately",
    "pay",
]

# ---------------------------------------------------
# API endpoint
# ---------------------------------------------------

@app.post("/analyze/")
async def analyze_offer(file: UploadFile = File(...)):

    content = await file.read()

    try:
        pdf = fitz.open(stream=content, filetype="pdf")
    except Exception:
        return {"error": "Invalid or corrupted PDF file"}

    text = ""

    # Extract normal text
    for page in pdf:
        text += page.get_text()

    pdf.close()

    # OCR fallback
    if not text.strip():
        images = convert_from_bytes(content)
        for image in images:
            text += pytesseract.image_to_string(image)

    if not text.strip():
        return {"error": "No readable text found in PDF"}

    text_lower = text.lower()

    # ---------------------------------------------------
    # ML Prediction
    # ---------------------------------------------------

    text_vector = vectorizer.transform([text])
    ml_probability = ml_model.predict_proba(text_vector)[0][1]
    ml_score = int(ml_probability * 100)

    # ---------------------------------------------------
    # Explainable AI
    # ---------------------------------------------------

    feature_names = vectorizer.get_feature_names_out()
    coefficients = ml_model.coef_[0]

    top_indices = coefficients.argsort()[-10:][::-1]

    top_suspicious_words = []

    top_suspicious_words = []

    for idx in top_indices:
        word = feature_names[idx]
        weight = coefficients[idx]

        if weight > 0 and word in text_lower:
            top_suspicious_words.append(word)

    top_suspicious_words = top_suspicious_words[:5]

    # ---------------------------------------------------
    # Rule-based analysis
    # ---------------------------------------------------

    urgency_score = 0
    financial_score = 0
    email_score = 0
    structure_score = 0

    reasons = []

    # Urgency patterns
    urgency_keywords = [
        "immediately",
        "urgent",
        "within 24 hours",
        "act fast",
        "limited time",
    ]

    for word in urgency_keywords:
        if word in text_lower:
            urgency_score += 10
            reasons.append(f"Urgency pattern detected: {word}")

    # Financial red flags
    financial_keywords = [
        "processing fee",
        "registration fee",
        "non-refundable",
        "payment required",
        "bank transfer",
        "upi",
    ]

    for word in financial_keywords:
        if word in text_lower:
            financial_score += 20
            reasons.append(f"Financial red flag detected: {word}")

    # Email intelligence
    emails = set(
        re.findall(
            r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
            text,
        )
    )

    for email in emails:
        domain = email.split("@")[1].lower()

        if domain in ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]:
            email_score += 30
            reasons.append(f"Free email domain detected: {domain}")

        if "-" in domain or any(char.isdigit() for char in domain):
            email_score += 15
            reasons.append(f"Suspicious domain pattern detected: {domain}")

    # Structural authenticity
    if "address" not in text_lower:
        structure_score += 10
        reasons.append("No company address found")

    if "www." not in text_lower and ".com" not in text_lower:
        structure_score += 10
        reasons.append("No official website detected")

    if not re.search(r"\+?\d{10,}", text):
        structure_score += 10
        reasons.append("No valid phone number detected")

    # ---------------------------------------------------
    # Final scoring
    # ---------------------------------------------------

    rule_score = urgency_score + financial_score + email_score + structure_score

    # Dynamic weighting
    if ml_score >= 70:
        combined_score = int((rule_score * 0.3) + (ml_score * 0.7))
    elif ml_score >= 40:
        combined_score = int((rule_score * 0.5) + (ml_score * 0.5))
    else:
        combined_score = int((rule_score * 0.6) + (ml_score * 0.4))

    fraud_score = min(combined_score, 100)

    # Risk level
    if fraud_score <= 30:
        risk_level = "LOW RISK"
    elif fraud_score <= 60:
        risk_level = "MEDIUM RISK"
    else:
        risk_level = "HIGH RISK"

    return {
        "filename": file.filename,
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "payment_risk": financial_score,
        "email_risk": email_score,
        "language_risk": urgency_score,
        "structure_risk": structure_score,
        "ml_score": ml_score,
        "reasons": reasons,
        "top_ml_keywords": top_suspicious_words,
    }
    # ---------------------------------------------------
# Text analysis endpoint
# ---------------------------------------------------

@app.post("/analyze-text/")
async def analyze_text(payload: dict = Body(...)):
    text = payload.get("text", "").strip()

    if not text:
        return {"error": "No text provided"}

    if len(text) < 50:
        return {"error": "Text is too short to analyze"}

    text_lower = text.lower()

    text_vector = vectorizer.transform([text])
    ml_probability = ml_model.predict_proba(text_vector)[0][1]
    ml_score = int(ml_probability * 100)

    feature_names = vectorizer.get_feature_names_out()
    coefficients = ml_model.coef_[0]
    top_indices = coefficients.argsort()[-10:][::-1]

    top_suspicious_words = []
    for idx in top_indices:
        word = feature_names[idx]
        weight = coefficients[idx]
        if weight > 0 and word in text_lower:
            top_suspicious_words.append(word)
    top_suspicious_words = top_suspicious_words[:5]

    urgency_score = 0
    financial_score = 0
    email_score = 0
    structure_score = 0
    reasons = []

    for word in ["immediately","urgent","within 24 hours","act fast","limited time"]:
        if word in text_lower:
            urgency_score += 10
            reasons.append(f"Urgency pattern detected: {word}")

    for word in ["processing fee","registration fee","non-refundable","payment required","bank transfer","upi"]:
        if word in text_lower:
            financial_score += 20
            reasons.append(f"Financial red flag detected: {word}")

    emails = set(re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text))
    for email in emails:
        domain = email.split("@")[1].lower()
        if domain in ["gmail.com","yahoo.com","outlook.com","hotmail.com"]:
            email_score += 30
            reasons.append(f"Free email domain detected: {domain}")
        if "-" in domain or any(char.isdigit() for char in domain):
            email_score += 15
            reasons.append(f"Suspicious domain pattern detected: {domain}")

    if "address" not in text_lower:
        structure_score += 10
        reasons.append("No company address found")
    if "www." not in text_lower and ".com" not in text_lower:
        structure_score += 10
        reasons.append("No official website detected")
    if not re.search(r"\+?\d{10,}", text):
        structure_score += 10
        reasons.append("No valid phone number detected")

    rule_score = urgency_score + financial_score + email_score + structure_score
    if ml_score >= 70:
        combined_score = int((rule_score * 0.3) + (ml_score * 0.7))
    elif ml_score >= 40:
        combined_score = int((rule_score * 0.5) + (ml_score * 0.5))
    else:
        combined_score = int((rule_score * 0.6) + (ml_score * 0.4))

    fraud_score = min(combined_score, 100)
    risk_level = "LOW RISK" if fraud_score <= 30 else "MEDIUM RISK" if fraud_score <= 60 else "HIGH RISK"

    return {
        "filename": "pasted-text",
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "payment_risk": financial_score,
        "email_risk": email_score,
        "language_risk": urgency_score,
        "structure_risk": structure_score,
        "ml_score": ml_score,
        "reasons": reasons,
        "top_ml_keywords": top_suspicious_words,
    }


# ---------------------------------------------------
# Run server
# ---------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=10000)