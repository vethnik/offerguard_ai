from fastapi import FastAPI, UploadFile, File, Body
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
# Shared rule engine function
# ---------------------------------------------------

def run_rule_engine(text, text_lower):
    urgency_score = 0
    financial_score = 0
    email_score = 0
    structure_score = 0
    reasons = []

    # ── Urgency patterns ──
    urgency_keywords = [
        "immediately", "urgent", "within 24 hours", "act fast",
        "limited time", "respond immediately", "confirm immediately",
        "reply immediately", "limited slots", "slot confirmation",
        "hurry", "act now", "time sensitive", "expires within",
        "offer expires", "seats are filling", "do not delay",
        "respond urgently", "within 48 hours", "last date", "deadline",
    ]
    for word in urgency_keywords:
        if word in text_lower:
            urgency_score += 10
            reasons.append(f"Urgency pattern detected: '{word}'")

    # ── Financial red flags ──
    financial_keywords = [
        "processing fee", "registration fee", "training fee",
        "documentation fee", "verification fee", "courier charges",
        "uniform fee", "id card fee", "onboarding fee",
        "security deposit", "caution deposit", "security amount",
        "refundable deposit", "welcome kit amount", "kit amount",
        "joining deposit", "advance deposit",
        "pay via upi", "send via upi", "transfer via upi",
        "neft transfer", "bank transfer", "send money",
        "transfer amount", "deposit amount", "pay now",
        "non-refundable", "payment required", "fee required",
        "amount required", "pay before joining", "pay to confirm",
        "payment confirmation", "send payment", "submit payment",
    ]
    for word in financial_keywords:
        if word in text_lower:
            financial_score += 20
            reasons.append(f"Financial red flag detected: '{word}'")

    # ── Payment + refund promise combo ──
    payment_words = ["deposit", "fee", "amount", "pay", "transfer", "send"]
    refund_words = ["refundable", "refund", "return", "reimburse", "adjustable"]
    has_payment = any(w in text_lower for w in payment_words)
    has_refund = any(w in text_lower for w in refund_words)
    if has_payment and has_refund:
        financial_score += 30
        reasons.append("Payment with refund promise detected (classic scam pattern)")

    # ── Email intelligence ──
    emails = set(re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text))
    for email in emails:
        domain = email.split("@")[1].lower()
        if domain in ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
                      "yahoo.in", "rediffmail.com", "ymail.com"]:
            email_score += 35
            reasons.append(f"Free email domain used: {domain}")
        if "-" in domain or any(char.isdigit() for char in domain.split(".")[0]):
            email_score += 15
            reasons.append(f"Suspicious domain pattern: {domain}")

    # ── Structural authenticity ──
    if "address" not in text_lower and "office" not in text_lower:
        structure_score += 10
        reasons.append("No company address found")
    if "www." not in text_lower and ".com" not in text_lower and ".in" not in text_lower:
        structure_score += 10
        reasons.append("No official website detected")
    if not re.search(r"\+?\d{10,}", text):
        structure_score += 10
        reasons.append("No valid phone number detected")

    # ── Unsolicited offer signal ──
    unsolicited_phrases = [
        "found your profile", "found in our database",
        "shortlisted from database", "profile found online",
        "you did not apply", "we found your cv",
        "your cv was found", "selected from database",
    ]
    for phrase in unsolicited_phrases:
        if phrase in text_lower:
            structure_score += 25
            reasons.append(f"Unsolicited offer signal: '{phrase}'")

    # ── WhatsApp only contact ──
    if "whatsapp" in text_lower and not re.search(r"\+?\d{10,}", text):
        structure_score += 20
        reasons.append("WhatsApp-only contact — no official phone number")

    # ── Org name mismatch ──
    org_pairs = [
        ("air india", "airports authority"),
        ("indian railway", "irctc"),
        ("sbi", "state bank of india"),
    ]
    for org1, org2 in org_pairs:
        if org1 in text_lower and org2 in text_lower:
            structure_score += 25
            reasons.append("Organization name mismatch detected")

    # ── Fake government job ──
    govt_scam_phrases = [
        "government of india recruitment",
        "central government job",
        "psu recruitment",
        "government vacancy",
        "sarkari naukri",
    ]
    for phrase in govt_scam_phrases:
        if phrase in text_lower:
            structure_score += 20
            reasons.append(f"Fake government job pattern: '{phrase}'")

    # ── Lottery job scam ──
    lottery_phrases = [
        "you have won", "lucky candidate", "lucky winner",
        "congratulations you are selected", "randomly selected",
        "you did not apply but", "selected without interview",
    ]
    for phrase in lottery_phrases:
        if phrase in text_lower:
            structure_score += 30
            reasons.append(f"Lottery job scam pattern: '{phrase}'")

    return urgency_score, financial_score, email_score, structure_score, reasons


# ---------------------------------------------------
# Shared scoring function
# ---------------------------------------------------

def calculate_final_score(ml_score, urgency_score, financial_score, email_score, structure_score):
    rule_score = urgency_score + financial_score + email_score + structure_score

    if ml_score >= 70:
        combined_score = int((rule_score * 0.3) + (ml_score * 0.7))
    elif ml_score >= 40:
        combined_score = int((rule_score * 0.5) + (ml_score * 0.5))
    else:
        combined_score = int((rule_score * 0.6) + (ml_score * 0.4))

    fraud_score = min(combined_score, 100)

    if fraud_score <= 30:
        risk_level = "LOW RISK"
    elif fraud_score <= 60:
        risk_level = "MEDIUM RISK"
    else:
        risk_level = "HIGH RISK"

    return fraud_score, risk_level


# ---------------------------------------------------
# Shared ML prediction function
# ---------------------------------------------------

def run_ml(text, text_lower):
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

    return ml_score, top_suspicious_words[:5]


# ---------------------------------------------------
# PDF Analysis endpoint
# ---------------------------------------------------

@app.post("/analyze/")
async def analyze_offer(file: UploadFile = File(...)):

    content = await file.read()

    try:
        pdf = fitz.open(stream=content, filetype="pdf")
    except Exception:
        return {"error": "Invalid or corrupted PDF file"}

    text = ""
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

    ml_score, top_suspicious_words = run_ml(text, text_lower)
    urgency_score, financial_score, email_score, structure_score, reasons = run_rule_engine(text, text_lower)
    fraud_score, risk_level = calculate_final_score(ml_score, urgency_score, financial_score, email_score, structure_score)

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
# Text Analysis endpoint
# ---------------------------------------------------

@app.post("/analyze-text/")
async def analyze_text(payload: dict = Body(...)):
    text = payload.get("text", "").strip()

    if not text:
        return {"error": "No text provided"}

    if len(text) < 50:
        return {"error": "Text is too short to analyze"}

    text_lower = text.lower()

    ml_score, top_suspicious_words = run_ml(text, text_lower)
    urgency_score, financial_score, email_score, structure_score, reasons = run_rule_engine(text, text_lower)
    fraud_score, risk_level = calculate_final_score(ml_score, urgency_score, financial_score, email_score, structure_score)

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