"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

function AnimatedNumber({ target }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [target]);
  return <>{current}</>;
}

function ScoreArc({ score }) {
  const radius = 80;
  const stroke = 8;
  const norm = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  const color =
    score >= 75 ? "#43D9A2" :
    score >= 50 ? "#FFD166" :
    "#FF6584";

  const label =
    score >= 75 ? "Strong Match 🎯" :
    score >= 50 ? "Moderate Match 📊" :
    "Needs Work 🔧";

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = norm - (progress / 100) * norm;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          {/* Progress */}
          <circle cx="100" cy="100" r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={norm}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color, lineHeight: 1 }}>
            <AnimatedNumber target={score} />
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>/ 100</span>
        </div>
      </div>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600, fontSize: 15,
        color, letterSpacing: "0.02em"
      }}>{label}</span>
    </div>
  );
}

function TagCloud({ items, type }) {
  const colors = {
    matched: { bg: "rgba(67,217,162,0.1)", border: "rgba(67,217,162,0.25)", text: "#43D9A2" },
    missing: { bg: "rgba(255,101,132,0.1)", border: "rgba(255,101,132,0.25)", text: "#FF6584" },
  };
  const c = colors[type];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      {items.map((item, i) => (
        <span key={i} style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.text,
          fontSize: 12,
          fontWeight: 500,
          padding: "5px 12px",
          borderRadius: 100,
          fontFamily: "'DM Sans', sans-serif",
          animation: `fadeUp 0.4s ${i * 0.05}s both ease`,
        }}>{item}</span>
      ))}
    </div>
  );
}

function Section({ icon, title, children, delay = 0 }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18,
      padding: "24px 28px",
      animation: `fadeUp 0.6s ${delay}s both cubic-bezier(0.16,1,0.3,1)`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)"
      }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 6
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: 14,
          color: "#F0F0FF",
          letterSpacing: "0.01em"
        }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function Results() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("result");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#080810", color: "#9090B0",
      flexDirection: "column", gap: 16, fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ fontSize: 40 }}>🔍</div>
      <p>No results found.</p>
      <button onClick={() => router.push("/")} style={{
        color: "#6C63FF", background: "none", border: "none",
        cursor: "pointer", fontSize: 14, textDecoration: "underline"
      }}>Go back and analyze a resume</button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080810;
          color: #F0F0FF;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.4;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .orb {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%);
          top: -100px; left: -80px;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(67,217,162,0.08) 0%, transparent 70%);
          bottom: -60px; right: -60px;
        }

        .nav {
          position: sticky; top: 0;
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
          background: rgba(8,8,16,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 18px;
          color: #F0F0FF; letter-spacing: -0.5px;
        }
        .nav-logo span { color: #6C63FF; }

        .btn-back {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #9090B0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px; border-radius: 100px;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-back:hover { color: #F0F0FF; border-color: rgba(255,255,255,0.15); }

        .page {
          position: relative; z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-header {
          text-align: center;
          animation: fadeUp 0.5s both cubic-bezier(0.16,1,0.3,1);
        }

        .result-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 5vw, 42px);
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .result-header p {
          font-size: 15px; color: #9090B0;
          font-weight: 300;
        }

        .score-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: fadeUp 0.5s 0.1s both cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
        }

        .score-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent);
        }

        .summary-text {
          font-size: 14px;
          color: #9090B0;
          text-align: center;
          line-height: 1.7;
          max-width: 520px;
          font-weight: 300;
        }

        .list-item {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13.5px;
          color: #B0B0D0;
          line-height: 1.6;
          font-weight: 300;
        }
        .list-item:last-child { border-bottom: none; }
        .list-arrow { color: #6C63FF; font-weight: 700; flex-shrink: 0; margin-top: 2px; }

        .btn-new {
          width: 100%;
          padding: 16px;
          background: transparent;
          color: #6C63FF;
          border: 1.5px solid rgba(108,99,255,0.4);
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          animation: fadeUp 0.5s 0.6s both cubic-bezier(0.16,1,0.3,1);
        }
        .btn-new:hover {
          background: rgba(108,99,255,0.08);
          border-color: rgba(108,99,255,0.7);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .nav { padding: 14px 20px; }
          .score-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <nav className="nav">
        <div className="nav-logo">Resume<span>AI</span></div>
        <button className="btn-back" onClick={() => router.push("/")}>← New Analysis</button>
      </nav>

      <main className="page">

        <div className="result-header">
          <h1>Your ATS Analysis</h1>
          <p>Here's how your resume performed against the job description</p>
        </div>

        {/* Score */}
        <div className="score-card">
          <ScoreArc score={data.score} />
          <p className="summary-text">{data.summary}</p>
        </div>

        {/* Keywords */}
        <Section icon="✅" title="Matched Keywords" delay={0.2}>
          <TagCloud items={data.matchedKeywords} type="matched" />
        </Section>

        <Section icon="❌" title="Missing Keywords" delay={0.25}>
          <p style={{ fontSize: 12, color: "#5A5A7A", marginTop: 4 }}>
            Add these to your resume where genuinely applicable
          </p>
          <TagCloud items={data.missingKeywords} type="missing" />
        </Section>

        {/* Strengths */}
        <Section icon="💪" title="Your Strengths" delay={0.3}>
          <div style={{ marginTop: 12 }}>
            {data.strengths.map((s, i) => (
              <div key={i} className="list-item">
                <span className="list-arrow">→</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Improvements */}
        <Section icon="💡" title="Improvements to Make" delay={0.35}>
          <div style={{ marginTop: 12 }}>
            {data.improvements.map((tip, i) => (
              <div key={i} className="list-item">
                <span className="list-arrow">→</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </Section>

        <button className="btn-new" onClick={() => router.push("/")}>
          ← Analyze Another Resume
        </button>

      </main>
    </>
  );
}
