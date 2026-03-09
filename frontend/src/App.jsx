import { useState, useEffect } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // Animate fraud score
  useEffect(() => {
    if (!result) return;

    let start = 0;
    const end = result.fraud_score;
    const duration = 1000;
    const incrementTime = 20;
    const step = end / (duration / incrementTime);

    const counter = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(counter);
        setDisplayScore(end);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [result]);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a PDF");

    try {
      setResult(null);
      setDisplayScore(0);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/analyze/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "LOW RISK") return "from-green-400 to-green-600";
    if (level === "MEDIUM RISK") return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const getVerdictMessage = () => {
    if (!result) return "";

    if (result.risk_level === "HIGH RISK") {
      return "⚠️ Strong indicators of job offer fraud detected. This document contains payment requests and suspicious language patterns commonly associated with recruitment scams.";
    }

    if (result.risk_level === "MEDIUM RISK") {
      return "⚠️ Some suspicious indicators detected. Please verify the company domain and confirm authenticity before proceeding.";
    }

    return "✅ No major fraud indicators detected. However, always verify job offers through official company channels.";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white overflow-hidden">
      {/* Glow Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Hero */}
      <section className="relative z-10 text-center py-24 px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          OfferGuard
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          AI-powered job offer fraud detection system. Detect scams before they
          detect you.
        </p>
      </section>

      {/* Upload Card */}
      <section className="relative z-10 flex justify-center px-4">
        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="cursor-pointer w-full md:w-auto">
              <div className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-center">
                {file ? "Change File" : "Upload PDF"}
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {file && (
              <span className="text-sm text-slate-400 truncate max-w-xs">
                {file.name}
              </span>
            )}

            <button
              onClick={handleUpload}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg w-full md:w-auto"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </section>

      {/* Result Section */}
      {result && (
        <section className="relative z-10 flex justify-center px-4 py-16">
          <div className="w-full max-w-3xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl mt-4 mb-6">
            {/* Score */}
            <h2 className="text-3xl font-bold mb-6">
              Fraud Score: {displayScore}%
            </h2>
            {/* Progress Bar */}
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-8">
              <div
                className={`h-full bg-gradient-to-r ${getRiskColor(result.risk_level)} transition-all duration-1000`}
                style={{ width: `${result.fraud_score}%` }}
              ></div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-6">

  <p className="text-sm text-blue-400 font-medium">
    ML Confidence: {result.ml_score}%
  </p>

  {result.top_ml_keywords && result.top_ml_keywords.length > 0 && (
    <div className="mt-3">
      <p className="text-sm text-slate-400 mb-2">
        🔍 ML Suspicious Keywords:
      </p>
      <div className="flex flex-wrap gap-2">
        {result.top_ml_keywords.map((word, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )}

</div>
            

            {/* Breakdown */}
            <div className="space-y-6 mb-8 text-sm">
              {[
                {
                  label: "💰 Payment Risk",
                  value: Number(result.payment_risk) || 0,
                  color: "bg-red-500",
                },
                {
                  label: "📧 Email Risk",
                  value: Number(result.email_risk) || 0,
                  color: "bg-yellow-400",
                },
                {
                  label: "📝 Language Risk",
                  value: Number(result.language_risk) || 0,
                  color: "bg-purple-500",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Badge */}
            <div
              className={`inline-block px-6 py-3 rounded-2xl font-bold text-lg bg-gradient-to-r ${getRiskColor(result.risk_level)}`}
            >
              {result.risk_level}
            </div>

            {/* AI Verdict */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-3 text-slate-300">
                AI Analysis Summary
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {getVerdictMessage()}
              </p>
            </div>

            {/* Reasons */}
            <div className="mt-6 max-h-64 overflow-y-auto space-y-3 pr-2">
              {result.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-3 rounded-xl border border-white/10 text-slate-300 text-sm"
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="text-center text-slate-500 pb-10 text-sm">
        © 2026 OfferGuard — AI Fraud Detection Platform
      </footer>
    </div>
  );
}
