import { useState, useRef, useCallback, useEffect } from "react";

/* ─── ANIMATED COUNTER HOOK ─── */
function useCounter(target, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

/* ─── STYLES ─── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#05080F;--surface:#090D17;--card:#0C1120;
  --border:#161F33;--border2:#1E2D47;
  --cyan:#00D4FF;--cyan-dim:rgba(0,212,255,0.1);--cyan-glow:rgba(0,212,255,0.25);
  --red:#FF3B5C;--amber:#FFB800;--green:#00E5A0;
  --text:#CBD5E1;--muted:#475569;
  --mono:'Space Mono',monospace;--sans:'Syne',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;overflow-x:hidden;}

.grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);}

.orb{position:fixed;border-radius:50%;filter:blur(110px);pointer-events:none;z-index:0;}
.orb-a{width:700px;height:700px;background:radial-gradient(circle,rgba(0,212,255,0.07),transparent 70%);top:-300px;left:-200px;animation:d1 18s ease-in-out infinite;}
.orb-b{width:600px;height:600px;background:radial-gradient(circle,rgba(255,59,92,0.06),transparent 70%);bottom:-200px;right:-150px;animation:d2 22s ease-in-out infinite;}
.orb-c{width:400px;height:400px;background:radial-gradient(circle,rgba(0,229,160,0.05),transparent 70%);top:40%;left:55%;animation:d1 14s ease-in-out infinite reverse;}
@keyframes d1{0%,100%{transform:translate(0,0)}33%{transform:translate(40px,-30px)}66%{transform:translate(-20px,40px)}}
@keyframes d2{0%,100%{transform:translate(0,0)}33%{transform:translate(-30px,20px)}66%{transform:translate(30px,-40px)}}

.wrap{position:relative;z-index:1;max-width:860px;margin:0 auto;padding:32px 24px 100px;}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:100px;}
.logo{display:flex;align-items:center;gap:12px;}
.logo-mark{width:36px;height:36px;display:flex;align-items:center;justify-content:center;position:relative;}
.logo-mark::before{content:'';position:absolute;inset:0;border:1.5px solid var(--cyan);border-radius:10px;
  box-shadow:0 0 20px var(--cyan-glow),inset 0 0 20px rgba(0,212,255,0.05);animation:bpulse 3s ease-in-out infinite;}
@keyframes bpulse{0%,100%{box-shadow:0 0 20px var(--cyan-glow)}50%{box-shadow:0 0 40px var(--cyan-glow)}}
.logo-mark svg{width:18px;height:18px;color:var(--cyan);}
.logo-text{font-family:var(--mono);font-size:17px;font-weight:700;color:#fff;}
.logo-text span{color:var(--cyan);}
.nav-right{display:flex;align-items:center;gap:10px;}
.nav-pill{font-family:var(--mono);font-size:10px;padding:5px 12px;border-radius:100px;border:1px solid var(--border2);color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:lp 2s ease-in-out infinite;}
@keyframes lp{0%,100%{opacity:1}50%{opacity:0.4}}

/* HERO */
.hero{text-align:center;margin-bottom:80px;}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;font-weight:700;
  letter-spacing:2.5px;text-transform:uppercase;color:var(--cyan);margin-bottom:28px;
  padding:8px 18px;border-radius:100px;border:1px solid rgba(0,212,255,0.2);background:rgba(0,212,255,0.05);}
.hero h1{font-size:clamp(52px,9vw,88px);font-weight:800;line-height:0.95;letter-spacing:-4px;color:#fff;margin-bottom:24px;}
.hero h1 em{font-style:normal;color:var(--cyan);position:relative;}
.hero h1 em::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:3px;background:var(--cyan);border-radius:2px;opacity:0.35;}
.hero-sub{font-size:18px;color:var(--muted);max-width:500px;margin:0 auto 48px;line-height:1.75;}

/* STATS */
.stats-strip{display:flex;justify-content:center;border:1px solid var(--border2);border-radius:16px;overflow:hidden;background:var(--surface);margin-bottom:64px;}
.stat-cell{flex:1;padding:20px 16px;text-align:center;border-right:1px solid var(--border2);}
.stat-cell:last-child{border-right:none;}
.stat-val{font-family:var(--mono);font-size:26px;font-weight:700;color:#fff;line-height:1;}
.stat-val .c{color:var(--cyan);}
.stat-key{font-size:11px;color:var(--muted);margin-top:6px;letter-spacing:0.5px;}

/* HOW */
.how{margin-bottom:64px;}
.how-title{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);text-align:center;margin-bottom:32px;}
.how-steps{display:flex;position:relative;}
.how-steps::before{content:'';position:absolute;top:27px;left:calc(16.67% + 14px);right:calc(16.67% + 14px);height:1px;background:linear-gradient(90deg,var(--border2),var(--cyan-dim),var(--border2));}
.how-step{flex:1;text-align:center;padding:0 12px;}
.step-num{width:56px;height:56px;border-radius:16px;background:var(--card);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:16px;margin:0 auto 16px;position:relative;z-index:1;transition:all 0.3s;}
.step-num.lit{border-color:var(--cyan);background:rgba(0,212,255,0.1);color:var(--cyan);box-shadow:0 0 24px rgba(0,212,255,0.25);}
.step-label{font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px;}
.step-sub{font-size:12px;color:var(--muted);line-height:1.5;}

/* UPLOAD */
.upload-card{background:var(--card);border:1px solid var(--border2);border-radius:24px;padding:8px;margin-bottom:28px;position:relative;overflow:hidden;transition:border-color 0.3s,box-shadow 0.3s;}
.upload-card.drag{border-color:var(--cyan);box-shadow:0 0 60px rgba(0,212,255,0.1);}
.drop-zone{border:1.5px dashed var(--border2);border-radius:18px;padding:56px 32px;text-align:center;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
.drop-zone:hover{border-color:var(--cyan);background:rgba(0,212,255,0.02);}
.drop-zone.ready{border-color:var(--green);border-style:solid;background:rgba(0,229,160,0.03);}

.pdf-wrap{position:relative;width:80px;height:80px;margin:0 auto 24px;}
.pdf-box{width:80px;height:80px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:36px;background:var(--surface);border:1px solid var(--border2);transition:all 0.3s;position:relative;z-index:1;}
.pdf-box.lit{background:var(--cyan-dim);border-color:rgba(0,212,255,0.3);box-shadow:0 0 32px var(--cyan-glow);}
.pdf-box.done{background:rgba(0,229,160,0.1);border-color:rgba(0,229,160,0.3);box-shadow:0 0 32px rgba(0,229,160,0.2);}
.ring{position:absolute;inset:-8px;border-radius:28px;border:1.5px solid var(--cyan);opacity:0;animation:ring 2s ease-out infinite;}
.ring:nth-child(2){animation-delay:0.8s;}
@keyframes ring{0%{opacity:0.7;transform:scale(0.85)}100%{opacity:0;transform:scale(1.4)}}
.scan-beam{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);box-shadow:0 0 20px var(--cyan);animation:beam 1.5s ease-in-out infinite;}
@keyframes beam{0%{top:0;opacity:1}100%{top:100%;opacity:0}}

.drop-title{font-size:20px;font-weight:700;color:#fff;margin-bottom:8px;}
.drop-sub{font-size:14px;color:var(--muted);}
.file-chip{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:8px 16px;border-radius:10px;background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);font-family:var(--mono);font-size:12px;color:var(--green);}

.err{margin:12px 8px;padding:14px 18px;background:rgba(255,59,92,0.07);border:1px solid rgba(255,59,92,0.2);border-radius:12px;font-size:14px;color:var(--red);display:flex;align-items:center;gap:10px;}

.btn-wrap{padding:8px;}
.abtn{width:100%;padding:18px 32px;font-family:var(--sans);font-size:16px;font-weight:700;border:none;border-radius:14px;cursor:pointer;position:relative;overflow:hidden;transition:all 0.25s;letter-spacing:0.3px;}
.abtn.go{background:var(--cyan);color:#000;}
.abtn.go::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.abtn.go:hover::before{transform:translateX(100%);}
.abtn.go:hover{box-shadow:0 0 48px rgba(0,212,255,0.5);transform:translateY(-1px);}
.abtn.go:disabled{opacity:0.35;cursor:not-allowed;transform:none;box-shadow:none;}
.abtn.scanning{background:var(--surface);color:var(--cyan);border:1px solid var(--cyan);}
.spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(0,212,255,0.25);border-top-color:var(--cyan);border-radius:50%;animation:sp 0.7s linear infinite;vertical-align:middle;margin-right:10px;}
@keyframes sp{to{transform:rotate(360deg)}}

/* RESULTS */
.results{animation:riseUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;}
@keyframes riseUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}

.threat{border-radius:24px;padding:44px 40px 36px;margin-bottom:20px;position:relative;overflow:hidden;border:1px solid;}
.threat.high{background:linear-gradient(135deg,rgba(255,59,92,0.07),rgba(255,59,92,0.02));border-color:rgba(255,59,92,0.3);}
.threat.medium{background:linear-gradient(135deg,rgba(255,184,0,0.07),rgba(255,184,0,0.02));border-color:rgba(255,184,0,0.3);}
.threat.low{background:linear-gradient(135deg,rgba(0,229,160,0.07),rgba(0,229,160,0.02));border-color:rgba(0,229,160,0.3);}
.threat::after{content:'';position:absolute;top:0;right:0;width:200px;height:200px;border-radius:0 24px 0 200px;opacity:0.07;}
.threat.high::after{background:var(--red);}
.threat.medium::after{background:var(--amber);}
.threat.low::after{background:var(--green);}

.t-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;gap:16px;flex-wrap:wrap;}
.t-eyebrow{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.t-file{font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:8px;}
.t-icon{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:30px;border:1px solid;flex-shrink:0;}
.t-icon.high{background:rgba(255,59,92,0.12);border-color:rgba(255,59,92,0.3);}
.t-icon.medium{background:rgba(255,184,0,0.12);border-color:rgba(255,184,0,0.3);}
.t-icon.low{background:rgba(0,229,160,0.12);border-color:rgba(0,229,160,0.3);}

.rbadge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:700;padding:7px 14px;border-radius:100px;letter-spacing:1.5px;text-transform:uppercase;}
.rbadge.high{background:rgba(255,59,92,0.15);color:var(--red);border:1px solid rgba(255,59,92,0.3);}
.rbadge.medium{background:rgba(255,184,0,0.15);color:var(--amber);border:1px solid rgba(255,184,0,0.3);}
.rbadge.low{background:rgba(0,229,160,0.15);color:var(--green);border:1px solid rgba(0,229,160,0.3);}
.rbadge-dot{width:5px;height:5px;border-radius:50%;}
.rbadge.high .rbadge-dot{background:var(--red);}
.rbadge.medium .rbadge-dot{background:var(--amber);}
.rbadge.low .rbadge-dot{background:var(--green);}

.score-row{display:flex;align-items:flex-end;gap:12px;margin-bottom:8px;}
.big-num{font-family:var(--mono);font-size:104px;font-weight:700;line-height:1;}
.big-num.high{color:var(--red);text-shadow:0 0 60px rgba(255,59,92,0.4);}
.big-num.medium{color:var(--amber);text-shadow:0 0 60px rgba(255,184,0,0.35);}
.big-num.low{color:var(--green);text-shadow:0 0 60px rgba(0,229,160,0.35);}
.score-denom{font-family:var(--mono);font-size:32px;color:var(--muted);margin-bottom:16px;}

.gauge{height:10px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;margin-bottom:10px;}
.gauge-fill{height:100%;border-radius:100px;transition:width 1.4s cubic-bezier(0.4,0,0.2,1);}
.gauge-fill.high{background:linear-gradient(90deg,var(--amber),var(--red));box-shadow:0 0 16px rgba(255,59,92,0.5);}
.gauge-fill.medium{background:linear-gradient(90deg,var(--green),var(--amber));box-shadow:0 0 16px rgba(255,184,0,0.4);}
.gauge-fill.low{background:linear-gradient(90deg,#00a86b,var(--green));box-shadow:0 0 16px rgba(0,229,160,0.4);}
.gauge-labels{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--muted);}

.verdict{margin-top:20px;padding:14px 18px;border-radius:12px;font-size:14px;font-weight:500;display:flex;align-items:center;gap:10px;line-height:1.5;}
.verdict.high{background:rgba(255,59,92,0.08);color:#ff8fa3;border:1px solid rgba(255,59,92,0.15);}
.verdict.medium{background:rgba(255,184,0,0.08);color:#ffd060;border:1px solid rgba(255,184,0,0.15);}
.verdict.low{background:rgba(0,229,160,0.08);color:#6effd4;border:1px solid rgba(0,229,160,0.15);}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
@media(max-width:600px){.g2{grid-template-columns:1fr;}}

.icard{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:24px;position:relative;overflow:hidden;}
.icard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--border2),transparent);}
.icard-title{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;display:flex;align-items:center;gap:8px;}
.icard-dot{width:4px;height:4px;border-radius:50%;background:var(--cyan);}

.bbar{margin-bottom:18px;}
.bbar:last-child{margin-bottom:0;}
.bbar-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;}
.bbar-label{font-size:13px;color:var(--text);font-weight:500;}
.bbar-val{font-family:var(--mono);font-size:12px;color:var(--muted);}
.bbar-track{height:4px;background:rgba(255,255,255,0.05);border-radius:100px;overflow:hidden;}
.bbar-fill{height:100%;border-radius:100px;transition:width 1.2s cubic-bezier(0.4,0,0.2,1) 0.2s;}

.mrow{display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid var(--border);}
.mrow:last-child{border-bottom:none;}
.mrow-label{font-size:13px;color:var(--muted);}
.mrow-val{font-family:var(--mono);font-size:13px;color:#fff;font-weight:700;}

.reason{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
.reason:last-child{border-bottom:none;}
.r-icon{width:20px;height:20px;border-radius:6px;background:rgba(255,59,92,0.1);border:1px solid rgba(255,59,92,0.2);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px;}
.r-text{font-size:13px;color:var(--text);line-height:1.55;}

.kw-grid{display:flex;flex-wrap:wrap;gap:8px;}
.kw{font-family:var(--mono);font-size:12px;font-weight:700;padding:7px 13px;border-radius:9px;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.18);color:var(--cyan);transition:all 0.2s;cursor:default;}
.kw:hover{background:rgba(0,212,255,0.14);box-shadow:0 0 20px rgba(0,212,255,0.2);transform:translateY(-1px);}
.kw-note{margin-top:14px;font-size:12px;color:var(--muted);line-height:1.6;font-style:italic;}

.reset-btn{width:100%;margin-top:20px;padding:15px;font-family:var(--sans);font-size:14px;font-weight:600;background:transparent;border:1px solid var(--border2);color:var(--muted);border-radius:14px;cursor:pointer;transition:all 0.2s;}
.reset-btn:hover{border-color:var(--cyan);color:var(--cyan);background:var(--cyan-dim);}

/* TABS */
.tabs{display:flex;gap:4px;background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:4px;margin-bottom:0;}
.tab{flex:1;padding:12px;font-family:var(--sans);font-size:14px;font-weight:600;border:none;border-radius:10px;cursor:pointer;transition:all 0.2s;background:transparent;color:var(--muted);display:flex;align-items:center;justify-content:center;gap:8px;}
.tab.active{background:var(--card);color:#fff;border:1px solid var(--border2);box-shadow:0 0 20px rgba(0,212,255,0.08);}
.tab:hover:not(.active){color:var(--text);}

/* TEXTAREA */
.text-area{width:100%;min-height:220px;background:var(--surface);border:1.5px solid var(--border2);border-radius:18px;padding:20px;font-family:var(--mono);font-size:13px;color:var(--text);resize:vertical;outline:none;transition:border-color 0.2s;line-height:1.7;}
.text-area:focus{border-color:var(--cyan);}
.text-area::placeholder{color:var(--muted);}
.char-count{font-family:var(--mono);font-size:11px;color:var(--muted);text-align:right;margin-top:8px;}

.footer{text-align:center;margin-top:80px;}
.footer-line{height:1px;background:linear-gradient(90deg,transparent,var(--border2),transparent);margin-bottom:24px;}
.footer-text{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:0.5px;}
`;

const rc = (s) => (s >= 61 ? "high" : s >= 31 ? "medium" : "low");
const rcol = (s) =>
  s >= 61 ? "var(--red)" : s >= 31 ? "var(--amber)" : "var(--green)";
const bg = (p) =>
  p >= 61
    ? "linear-gradient(90deg,var(--amber),var(--red))"
    : p >= 31
      ? "linear-gradient(90deg,var(--green),var(--amber))"
      : "linear-gradient(90deg,#00a86b,var(--green))";
const icon = (c) => (c === "high" ? "💀" : c === "medium" ? "⚠️" : "✅");
const verd = (c) =>
  c === "high"
    ? "High fraud probability — do not share personal info or pay any fees."
    : c === "medium"
      ? "Suspicious signals detected — verify the company before proceeding."
      : "Low risk — this offer appears legitimate. Always verify independently.";
const downloadReport = (result, riskClass) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(5, 8, 15);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("OfferGuard", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("AI Fraud Detection Report", 14, 27);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

  const riskColor =
    riskClass === "high"
      ? [255, 59, 92]
      : riskClass === "medium"
        ? [255, 184, 0]
        : [0, 229, 160];

  // Score box
  doc.setFillColor(...riskColor);
  doc.roundedRect(14, 48, 80, 30, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.fraud_score}/100`, 20, 68);

  // Risk level box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(100, 48, 95, 30, 3, 3, "F");
  doc.setTextColor(...riskColor);
  doc.setFontSize(14);
  doc.text(result.risk_level, 106, 60);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`File: ${result.filename}`, 106, 70);

  doc.setDrawColor(30, 45, 71);
  doc.line(14, 86, pageW - 14, 86);

  // Score breakdown
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SCORE BREAKDOWN", 14, 96);

  const breakdown = [
    ["ML Score", `${result.ml_score}/100`],
    [
      "Rule Score",
      `${result.payment_risk + result.email_risk + result.language_risk + result.structure_risk} pts`,
    ],
    ["Financial Risk", `${result.payment_risk} pts`],
    ["Email Risk", `${result.email_risk} pts`],
    ["Language Risk", `${result.language_risk} pts`],
    ["Structure Risk", `${result.structure_risk} pts`],
  ];

  let y = 106;
  breakdown.forEach(([label, val]) => {
    doc.setFillColor(12, 17, 32);
    doc.rect(14, y - 5, pageW - 28, 10, "F");
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(label, 18, y + 2);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...riskColor);
    doc.text(val, pageW - 18, y + 2, { align: "right" });
    y += 12;
  });

  y += 6;
  doc.setDrawColor(30, 45, 71);
  doc.line(14, y, pageW - 14, y);
  y += 10;

  // Fraud signals
  if (result.reasons?.length > 0) {
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("FRAUD SIGNALS DETECTED", 14, y);
    y += 10;
    result.reasons.forEach((reason) => {
      doc.setFillColor(12, 17, 32);
      doc.rect(14, y - 5, pageW - 28, 10, "F");
      doc.setTextColor(255, 143, 163);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(`• ${reason}`, pageW - 36);
      doc.text(lines, 18, y + 2);
      y += lines.length * 10 + 2;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    y += 6;
  }

  // ML Keywords
  if (result.top_ml_keywords?.length > 0) {
    doc.setDrawColor(30, 45, 71);
    doc.line(14, y, pageW - 14, y);
    y += 10;
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ML SUSPICIOUS KEYWORDS", 14, y);
    y += 10;
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(result.top_ml_keywords.join("   •   "), 14, y);
    y += 16;
  }

  // Footer
  doc.setDrawColor(30, 45, 71);
  doc.line(14, y, pageW - 14, y);
  y += 8;
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("OfferGuard · AI Fraud Detection Platform", pageW / 2, y, {
    align: "center",
  });
  doc.text(
    "Always verify offer letters independently before accepting.",
    pageW / 2,
    y + 6,
    { align: "center" },
  );

  doc.save(`OfferGuard_Report_${result.filename}.pdf`);
};
// ── Confidence level based on number of signals found ──
const confidence = (signals) => {
  if (signals >= 5)
    return { label: "Very High Confidence", color: "var(--red)" };
  if (signals >= 3) return { label: "High Confidence", color: "var(--amber)" };
  if (signals >= 2) return { label: "Medium Confidence", color: "var(--cyan)" };
  return { label: "Low Confidence", color: "var(--muted)" };
};

export default function App() {
  const [tab, setTab] = useState("pdf");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("og_history") || "[]");
    } catch {
      return [];
    }
  });
  const inputRef = useRef();

  const animScore = useCounter(result?.fraud_score ?? 0, 1400, ready);
  useEffect(() => {
    if (result) setTimeout(() => setReady(true), 300);
  }, [result]);

  const pick = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    setReady(false);
  };
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files[0]);
  }, []);

  const switchTab = (t) => {
    setTab(t);
    setError(null);
    setResult(null);
  };

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setReady(false);
    try {
      let res;
      if (tab === "pdf") {
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("/analyze/", { method: "POST", body: fd });
      } else {
        if (!text.trim()) return;
        res = await fetch("/analyze-text/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        const newEntry = {
          id: Date.now(),
          filename: data.filename,
          score: data.fraud_score,
          risk: data.risk_level,
          time: new Date().toLocaleString(),
        };
        setHistory((prev) => {
          const updated = [newEntry, ...prev].slice(0, 10);
          localStorage.setItem("og_history", JSON.stringify(updated));
          return updated;
        });
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = tab === "pdf" ? !!file : text.trim().length >= 50;
  const reset = () => {
    setResult(null);
    setFile(null);
    setText("");
    setError(null);
    setReady(false);
  };

  const riskClass = result ? rc(result.fraud_score) : "";
  const bd = result
    ? [
        { label: "Financial Risk", val: result.payment_risk, max: 100 },
        { label: "Email Risk", val: result.email_risk, max: 80 },
        { label: "Language Risk", val: result.language_risk, max: 50 },
        { label: "Structure Risk", val: result.structure_risk, max: 30 },
      ]
    : [];

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="wrap">
        {/* NAV */}
        <nav className="nav">
          <div className="logo">
            <div className="logo-mark">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="logo-text">
              Offer<span>Guard</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="live-dot" />
            <div className="nav-pill">System Live</div>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="eyebrow">⚡ AI Fraud Detection</div>
          <h1>
            Is Your Offer
            <br />
            <em>Legit?</em>
          </h1>
          <p className="hero-sub">
            Upload any job offer PDF and our AI scans it for scam signals in
            under 3 seconds.
          </p>
        </div>

        {/* STATS */}
        <div className="stats-strip">
          {[
            ["92", "%", "ML Accuracy"],
            ["2", "", "Detection Engines"],
            ["10", "+", "Fraud Signals"],
            ["<3", "s", "Scan Time"],
          ].map(([v, u, k]) => (
            <div className="stat-cell" key={k}>
              <div className="stat-val">
                {v}
                <span className="c">{u}</span>
              </div>
              <div className="stat-key">{k}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="how">
          <div className="how-title">— How it works —</div>
          <div className="how-steps">
            {[
              ["01", "Upload PDF", "Drop your offer letter", true],
              ["02", "AI Scans", "ML + rule engine runs", true],
              ["03", "Get Score", "Instant fraud report", true],
            ].map(([n, l, s, lit]) => (
              <div className="how-step" key={n}>
                <div className={`step-num ${lit ? "lit" : ""}`}>{n}</div>
                <div className="step-label">{l}</div>
                <div className="step-sub">{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* UPLOAD */}
        {!result && (
          <div className="upload-card" style={{ padding: "8px" }}>
            <div className="tabs" style={{ marginBottom: "8px" }}>
              <button
                className={`tab ${tab === "pdf" ? "active" : ""}`}
                onClick={() => switchTab("pdf")}
              >
                📄 Upload PDF
              </button>
              <button
                className={`tab ${tab === "text" ? "active" : ""}`}
                onClick={() => switchTab("text")}
              >
                ✍️ Paste Text
              </button>
            </div>

            {tab === "pdf" && (
              <div
                className={`drop-zone ${file ? "ready" : ""} ${drag ? "drag" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current.click()}
              >
                {loading && <div className="scan-beam" />}
                <div className="pdf-wrap">
                  {loading && (
                    <>
                      <div className="ring" />
                      <div className="ring" />
                    </>
                  )}
                  <div
                    className={`pdf-box ${loading ? "lit" : file ? "done" : ""}`}
                  >
                    {loading ? "🔍" : file ? "📄" : "📂"}
                  </div>
                </div>
                {file ? (
                  <>
                    <div className="drop-title">
                      {loading ? "Scanning document…" : "File Ready"}
                    </div>
                    <div className="drop-sub">
                      {loading
                        ? "Running ML model and rule checks"
                        : "Click Analyze to run fraud detection"}
                    </div>
                    <div className="file-chip">📎 {file.name}</div>
                  </>
                ) : (
                  <>
                    <div className="drop-title">Drop your PDF here</div>
                    <div className="drop-sub">
                      or click to browse · PDF files only
                    </div>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => pick(e.target.files[0])}
                />
              </div>
            )}

            {tab === "text" && (
              <div style={{ padding: "8px" }}>
                <textarea
                  className="text-area"
                  placeholder="Paste your job offer text here…&#10;&#10;Example: 'Dear Candidate, We are pleased to offer you the position of Software Engineer. Please send a processing fee of $50 to confirm your slot. Respond immediately as slots are limited.'"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="char-count">
                  {text.length} chars{" "}
                  {text.length < 50 && text.length > 0
                    ? "· min 50 required"
                    : ""}
                </div>
              </div>
            )}

            {error && <div className="err">⚠ {error}</div>}
            <div className="btn-wrap">
              <button
                className={`abtn ${loading ? "scanning" : "go"}`}
                onClick={analyze}
                disabled={!canAnalyze || loading}
              >
                {loading ? (
                  <>
                    <span className="spin" />
                    Analyzing…
                  </>
                ) : (
                  "→ Analyze for Fraud"
                )}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="results">
            <div className={`threat ${riskClass}`}>
              <div className="t-top">
                <div>
                  <div className="t-eyebrow">Fraud Analysis Report</div>

                  {/* RISK BADGE + CONFIDENCE BADGE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <div className={`rbadge ${riskClass}`}>
                      <div className="rbadge-dot" />
                      {result.risk_level}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        fontWeight: "700",
                        color: confidence(result.reasons?.length ?? 0).color,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${confidence(result.reasons?.length ?? 0).color}`,
                        padding: "5px 12px",
                        borderRadius: "100px",
                        opacity: "0.85",
                      }}
                    >
                      ⚡ {confidence(result.reasons?.length ?? 0).label}
                    </div>
                  </div>

                  <div className="t-file">📎 {result.filename}</div>
                </div>
                <div className={`t-icon ${riskClass}`}>{icon(riskClass)}</div>
              </div>

              <div className="score-row">
                <div className={`big-num ${riskClass}`}>{animScore}</div>
                <div className="score-denom">/100</div>
              </div>
              <div className="gauge">
                <div
                  className={`gauge-fill ${riskClass}`}
                  style={{ width: `${result.fraud_score}%` }}
                />
              </div>
              <div className="gauge-labels">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
              <div className={`verdict ${riskClass}`}>
                {riskClass === "high"
                  ? "🚨"
                  : riskClass === "medium"
                    ? "⚡"
                    : "✓"}
                &nbsp;{verd(riskClass)}
              </div>
            </div>

            <div className="g2">
              <div className="icard">
                <div className="icard-title">
                  <div className="icard-dot" />
                  Risk Breakdown
                </div>
                {bd.map((b) => {
                  const pct = Math.min(100, Math.round((b.val / b.max) * 100));
                  return (
                    <div className="bbar" key={b.label}>
                      <div className="bbar-head">
                        <span className="bbar-label">{b.label}</span>
                        <span className="bbar-val">{b.val} pts</span>
                      </div>
                      <div className="bbar-track">
                        <div
                          className="bbar-fill"
                          style={{ width: `${pct}%`, background: bg(pct) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="icard">
                <div className="icard-title">
                  <div className="icard-dot" />
                  Model Details
                </div>
                {[
                  {
                    label: "ML Score",
                    val: `${result.ml_score}/100`,
                    color: rcol(result.ml_score),
                  },
                  {
                    label: "Rule Score",
                    val: `${result.payment_risk + result.email_risk + result.language_risk + result.structure_risk} pts`,
                  },
                  {
                    label: "Final Score",
                    val: `${result.fraud_score}/100`,
                    color: rcol(result.fraud_score),
                  },
                  {
                    label: "Signals Found",
                    val: `${result.reasons?.length ?? 0}`,
                  },
                ].map((r) => (
                  <div className="mrow" key={r.label}>
                    <span className="mrow-label">{r.label}</span>
                    <span
                      className="mrow-val"
                      style={r.color ? { color: r.color } : {}}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="g2">
              {result.reasons?.length > 0 && (
                <div className="icard">
                  <div className="icard-title">
                    <div className="icard-dot" />
                    Fraud Signals Detected
                  </div>
                  {result.reasons.map((r, i) => (
                    <div className="reason" key={i}>
                      <div className="r-icon">⚑</div>
                      <div className="r-text">{r}</div>
                    </div>
                  ))}
                </div>
              )}
              {result.top_ml_keywords?.length > 0 && (
                <div className="icard">
                  <div className="icard-title">
                    <div className="icard-dot" />
                    ML Suspicious Keywords
                  </div>
                  <div className="kw-grid">
                    {result.top_ml_keywords.map((k, i) => (
                      <div className="kw" key={i}>
                        {k}
                      </div>
                    ))}
                  </div>
                  <div className="kw-note">
                    These words contributed most to the ML model's fraud
                    prediction.
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button
                className="reset-btn"
                style={{ margin: 0 }}
                onClick={reset}
              >
                ← Analyze Another Document
              </button>
              <button
                onClick={() => downloadReport(result, riskClass)}
                style={{
                  padding: "15px 24px",
                  fontFamily: "var(--sans)",
                  fontSize: "14px",
                  fontWeight: "600",
                  background: "var(--cyan)",
                  color: "#000",
                  border: "none",
                  borderRadius: "14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                ↓ Download Report
              </button>
            </div>
          </div>
        )}
        {/* SCAN HISTORY */}
        {history.length > 0 && !result && (
          <div className="icard" style={{ marginBottom: "32px" }}>
            <div className="icard-title">
              <div className="icard-dot" />
              Recent Scans
              <span
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("og_history");
                }}
                style={{
                  marginLeft: "auto",
                  fontSize: "10px",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontWeight: "400",
                }}
              >
                Clear
              </span>
            </div>
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {h.filename}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "3px",
                    }}
                  >
                    {h.time}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "11px",
                    fontWeight: "700",
                    color:
                      h.score >= 61
                        ? "var(--red)"
                        : h.score >= 31
                          ? "var(--amber)"
                          : "var(--green)",
                    textAlign: "right",
                  }}
                >
                  <div>{h.score}/100</div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>{h.risk}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="footer">
          <div className="footer-line" />
          <div className="footer-text">
            © 2026 OfferGuard · AI Fraud Detection Platform · github.com/vethnik
          </div>
        </div>
      </div>
    </>
  );
}
