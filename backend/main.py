from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import fitz
import re
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import joblib
import os
import re


pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_PATH")
app = FastAPI()
origins = [
    "http://localhost:5173",
    "https://offerguard-backend.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load ML model
MODEL_PATH = os.path.join("ml", "fraud_model.pkl")
VECTORIZER_PATH = os.path.join("ml", "vectorizer.pkl")

ml_model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "OfferGuard is running"}


SUSPICIOUS_WORDS = [
    "processing fee",
    "registration fee",
    "urgent payment",
    "non-refundable",
    "limited slots",
    "immediately",
    "pay",
]


@app.post("/analyze/")
async def analyze_offer(file: UploadFile = File(...)):

    # Read file
    content = await file.read()

    # Try opening PDF safely
    try:
        pdf = fitz.open(stream=content, filetype="pdf")
    except Exception:
        return {"error": "Invalid or corrupted PDF file"}

    # Extract text
    text = ""

    # First try normal text extraction
    for page in pdf:
        text += page.get_text()

    pdf.close()

    # 🔥 OCR fallback if no text found
    if not text.strip():
        images = convert_from_bytes(content)

        for image in images:
            text += pytesseract.image_to_string(image)

    # pdf.close()

    if not text.strip():
        return {"error": "No readable text found in PDF"}

    text_lower = text.lower()
    # ===== ML Prediction =====
    text_vector = vectorizer.transform([text])
    ml_prediction = ml_model.predict(text_vector)[0]
    ml_probability = ml_model.predict_proba(text_vector)[0][1]
    ml_score = int(ml_probability * 100)

    # ===== Explainable AI =====
    feature_names = vectorizer.get_feature_names_out()
    coefficients = ml_model.coef_[0]

    # Get top positive contributing words
    top_indices = coefficients.argsort()[-10:][::-1]

    top_suspicious_words = []
    for idx in top_indices:
        word = feature_names[idx]
        weight = coefficients[idx]
        if weight > 0:
            top_suspicious_words.append(word)

    top_suspicious_words = top_suspicious_words[:5]
    
    # Initialize scores
    urgency_score = 0
    financial_score = 0
    email_score = 0
    structure_score = 0
    reasons = []

    text_lower = text.lower()

    # 🔴 Layer 1 — Urgency Patterns
    urgency_keywords = [
        "immediately",
        "urgent",
        "within 24 hours",
        "act fast",
        "limited time"
    ]

    for word in urgency_keywords:
        if word in text_lower:
            urgency_score += 10
            reasons.append(f"Urgency pattern detected: {word}")

    # 🟠 Layer 2 — Financial Red Flags
    financial_keywords = [
        "processing fee",
        "registration fee",
        "non-refundable",
        "payment required",
        "bank transfer",
        "upi"
    ]

    for word in financial_keywords:
        if word in text_lower:
            financial_score += 20
            reasons.append(f"Financial red flag detected: {word}")

    # 🟡 Layer 3 — Email Intelligence
    
    emails = set(re.findall(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text
    ))

    for email in emails:
        domain = email.split("@")[1].lower()

        if domain in ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]:
            email_score += 30
            reasons.append(f"Free email domain detected: {domain}")

        if "-" in domain or any(char.isdigit() for char in domain):
            email_score += 15
            reasons.append(f"Suspicious domain pattern detected: {domain}")

    # 🟢 Layer 4 — Structural Authenticity
    if "address" not in text_lower:
        structure_score += 10
        reasons.append("No company address found")

    if "www." not in text_lower and ".com" not in text_lower:
        structure_score += 10
        reasons.append("No official website detected")

    if not re.search(r"\+?\d{10,}", text):
        structure_score += 10
        reasons.append("No valid phone number detected")

    # Final Score
    # ===== Rule-Based Score =====
    rule_score = urgency_score + financial_score + email_score + structure_score

    # ===== Combine ML + Rule =====
        # ===== Dynamic Weighting =====
    if ml_score >= 70:
        combined_score = int((rule_score * 0.3) + (ml_score * 0.7))
    elif ml_score >= 40:
        combined_score = int((rule_score * 0.5) + (ml_score * 0.5))
    else:
        combined_score = int((rule_score * 0.6) + (ml_score * 0.4))

    fraud_score = min(combined_score, 100)


    # Risk Level
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)