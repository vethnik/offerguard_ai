# 🛡️ OfferGuard — AI Fraud Detection System

> **Detect fake job offers before they detect you.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-offerguard--089q.onrender.com-00D4FF?style=for-the-badge&logo=render)](https://offerguard-089q.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

---

## 📌 What is OfferGuard?

OfferGuard is an **AI-powered fake job offer detection system** that analyzes job offer letters and determines whether they are genuine or fraudulent.

Fake job offers are a growing problem — scammers trick students and job seekers into paying money by pretending to be legitimate companies. OfferGuard solves this by combining **Machine Learning** with a **rule-based detection engine** to give users an instant fraud risk score from 0 to 100.

---

## 🚀 Live Demo

👉 **[offerguard-089q.onrender.com](https://offerguard-089q.onrender.com)**

---

## ✨ Features

- 📄 **PDF Upload** — Upload any job offer PDF for instant analysis
- ✍️ **Text Paste** — Paste offer letter text directly for quick scanning
- 🤖 **ML Model** — Logistic Regression + TF-IDF with ~92% accuracy
- 🔍 **Rule Engine** — 30+ fraud signal patterns including Indian scam patterns
- 💀 **Risk Score** — Dynamic fraud score from 0–100 (LOW / MEDIUM / HIGH RISK)
- 🧠 **Explainable AI** — Shows exactly why a document was flagged
- ⚡ **Confidence Badge** — Indicates how confident the system is
- 📋 **Scan History** — Stores past scans in browser localStorage
- 📥 **PDF Report Download** — Download a detailed fraud analysis report
- 🔒 **OCR Support** — Handles scanned PDFs using Tesseract OCR

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| JavaScript | Logic |
| jsPDF | PDF report generation |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| Python 3.11 | Core language |
| Uvicorn | ASGI server |
| PyMuPDF | PDF text extraction |
| pdf2image + Tesseract | OCR for scanned PDFs |
| scikit-learn | ML model |
| joblib | Model persistence |

### Deployment
| Tool | Purpose |
|---|---|
| Render | Cloud hosting |
| Docker | Containerization |
| GitHub | CI/CD |
| UptimeRobot | Keep-alive monitoring |

---

## 🧠 How It Works

```
User uploads PDF / pastes text
        ↓
Text extraction (PyMuPDF)
        ↓
OCR fallback if scanned (Tesseract)
        ↓
ML Model scores it (Logistic Regression + TF-IDF)
        ↓
Rule Engine checks 30+ fraud patterns
        ↓
Dynamic weighted scoring
        ↓
Fraud Score + Risk Level + Explanation
```

### Dynamic Scoring Formula
```python
if ml_score >= 70:
    combined = (rule_score × 0.3) + (ml_score × 0.7)  # Trust ML more
elif ml_score >= 40:
    combined = (rule_score × 0.5) + (ml_score × 0.5)  # Equal weight
else:
    combined = (rule_score × 0.6) + (ml_score × 0.4)  # Trust rules more
```

### Risk Levels
| Score | Risk Level |
|---|---|
| 0 – 30 | ✅ LOW RISK |
| 31 – 60 | ⚠️ MEDIUM RISK |
| 61 – 100 | 🚨 HIGH RISK |

---

## 🔍 Fraud Signals Detected

- 💰 Payment requests (processing fee, security deposit, registration fee, welcome kit amount)
- ⚡ Urgency language (immediately, within 24 hours, act fast, limited slots)
- 📧 Free email domains (gmail.com, yahoo.com, hotmail.com)
- 🏢 Organization name mismatch
- 📱 WhatsApp-only contact
- 🎰 Lottery job scams (lucky candidate, randomly selected)
- 🏛️ Fake government job patterns
- 💳 UPI / bank transfer payment requests
- 🔄 Payment with refund promise (classic scam pattern)

---

## 📁 Project Structure

```
offerguard/
│
├── Dockerfile               ← Docker config for Render
├── railway.json             ← Deployment settings
├── README.md
│
├── backend/
│   ├── main.py              ← FastAPI server (core logic)
│   ├── requirements.txt     ← Python dependencies
│   ├── runtime.txt          ← Python 3.11.9
│   │
│   ├── ml/
│   │   ├── fraud_model.pkl  ← Trained Logistic Regression model
│   │   ├── vectorizer.pkl   ← Trained TF-IDF vectorizer
│   │   ├── train_model.py   ← Model training script
│   │   └── dataset.csv      ← Training dataset
│   │
│   └── static/dist/         ← React production build
│
└── frontend/
    ├── src/
    │   ├── App.jsx          ← Main React component
    │   └── main.jsx         ← Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🏃 Run Locally

### Prerequisites
- Python 3.11
- Node.js 18+
- Tesseract OCR installed
- Poppler installed

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🐳 Deploy with Docker

```bash
docker build -t offerguard .
docker run -p 8000:8000 -e TESSERACT_PATH=/usr/bin/tesseract offerguard
```

---

## 📊 Model Performance

| Metric | Score |
|---|---|
| Accuracy | ~92% |
| Precision | 0.93 |
| Recall | 0.93 |
| F1 Score | 0.93 |

---

## 🗺️ Roadmap

- [ ] User accounts and login
- [ ] PostgreSQL database for scan history
- [ ] Batch PDF upload
- [ ] Browser extension for Gmail
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] XGBoost model upgrade

---

## 👨‍💻 Author

**Mekala Venkata Shiva Sai Vethnik**

[![GitHub](https://img.shields.io/badge/GitHub-vethnik-181717?style=flat&logo=github)](https://github.com/vethnik)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vethnik-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/vethnik)

---

## ⚠️ Disclaimer

OfferGuard is an AI-powered tool and may not catch all fraudulent offers. Always verify job offers independently by contacting the company through official channels before accepting or making any payments.

---

<div align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</div>
