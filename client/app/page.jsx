"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();
  const heroRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Animate on mount using CSS animations
    const elements = document.querySelectorAll(".animate-in");
    elements.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.12}s`;
      el.classList.add("visible");
    });
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResume(file);
    else setError("Please drop a PDF file.");
  };

  const handleSubmit = async () => {
    setError("");
    if (!resume) return setError("Upload your resume PDF first.");
    if (!jd.trim()) return setError("Paste the job description.");
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jd);
    try {
      const { data } = await axios.post(
        "https://resumeai-ats-scaner.onrender.com/api/analyze",
        formData,
      );
      sessionStorage.setItem("result", JSON.stringify(data));
      router.push("/results");
    } catch {
      setError("Server error. Make sure your backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080810;
          --surface: #0f0f1a;
          --surface2: #151524;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.15);
          --accent: #6C63FF;
          --accent2: #FF6584;
          --accent3: #43D9A2;
          --text: #F0F0FF;
          --text2: #9090B0;
          --text3: #5A5A7A;
          --glow: rgba(108,99,255,0.3);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Grain overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.4;
        }

        /* Ambient orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: float1 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,101,132,0.1) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: float2 10s ease-in-out infinite;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(67,217,162,0.08) 0%, transparent 70%);
          top: 50%; left: 60%;
          animation: float3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(40px, 30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(-30px, -40px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(20px, -30px); }
        }

        /* Page */
        .page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        /* Nav */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 50;
          background: linear-gradient(to bottom, rgba(8,8,16,0.9) 0%, transparent 100%);
          backdrop-filter: blur(10px);
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: var(--text);
          letter-spacing: -0.5px;
        }

        .nav-logo span { color: var(--accent); }

        .nav-badge {
          font-size: 11px;
          color: var(--text3);
          border: 1px solid var(--border);
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Animate in */
        .animate-in {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                      transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .animate-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero */
        .hero { text-align: center; max-width: 720px; margin-bottom: 56px; }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid rgba(108,99,255,0.3);
          background: rgba(108,99,255,0.08);
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
        }

        .hero-eyebrow::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 6vw, 64px);
          line-height: 1.05;
          letter-spacing: -2px;
          color: var(--text);
          margin-bottom: 20px;
        }

        .hero h1 .grad {
          background: linear-gradient(135deg, #6C63FF 0%, #FF6584 50%, #43D9A2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 17px;
          color: var(--text2);
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
          font-weight: 300;
        }

        /* Stats row */
        .stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: var(--text);
        }

        .stat-label {
          font-size: 11px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stat-div {
          width: 1px;
          height: 32px;
          background: var(--border);
        }

        /* Card */
        .card {
          width: 100%;
          max-width: 680px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 0 1px var(--border), 0 40px 80px rgba(0,0,0,0.4);
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent);
        }

        /* Upload zone */
        .upload-zone {
          border: 1.5px dashed var(--border-hover);
          border-radius: 16px;
          padding: 40px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
          background: var(--surface2);
        }

        .upload-zone:hover, .upload-zone.drag {
          border-color: var(--accent);
          background: rgba(108,99,255,0.05);
          transform: scale(1.01);
        }

        .upload-zone.has-file {
          border-color: var(--accent3);
          background: rgba(67,217,162,0.05);
        }

        .upload-icon {
          width: 52px; height: 52px;
          margin: 0 auto 16px;
          background: rgba(108,99,255,0.12);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 1px solid rgba(108,99,255,0.2);
        }

        .upload-zone.has-file .upload-icon {
          background: rgba(67,217,162,0.12);
          border-color: rgba(67,217,162,0.2);
        }

        .upload-title {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
          margin-bottom: 6px;
        }

        .upload-sub {
          font-size: 12px;
          color: var(--text3);
        }

        .upload-filename {
          font-size: 13px;
          color: var(--accent3);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Divider */
        .field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Textarea */
        .jd-area {
          width: 100%;
          background: var(--surface2);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 16px 18px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          line-height: 1.65;
          resize: none;
          height: 160px;
          outline: none;
          transition: border-color 0.2s ease;
          margin-bottom: 24px;
        }

        .jd-area:focus {
          border-color: rgba(108,99,255,0.5);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.08);
        }

        .jd-area::placeholder { color: var(--text3); }

        /* Error */
        .error-msg {
          font-size: 12.5px;
          color: var(--accent2);
          text-align: center;
          margin-bottom: 16px;
          padding: 10px 16px;
          background: rgba(255,101,132,0.08);
          border: 1px solid rgba(255,101,132,0.15);
          border-radius: 8px;
        }

        /* Submit button */
        .btn-analyze {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #6C63FF, #9B94FF);
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(108,99,255,0.35);
        }

        .btn-analyze::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn-analyze:hover::before { opacity: 1; }
        .btn-analyze:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(108,99,255,0.45); }
        .btn-analyze:active { transform: translateY(0); }
        .btn-analyze:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Loading spinner */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Features strip */
        .features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text3);
        }

        .feature-item span:first-child { font-size: 14px; }

        /* Responsive */
        @media (max-width: 640px) {
          .nav { padding: 16px 20px; }
          .card { padding: 28px 20px; border-radius: 20px; }
          .stats { gap: 20px; }
          .stat-div { display: none; }
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">Resume<span>AI</span></div>
        <div className="nav-badge">Powered by Gemini</div>
      </nav>

      <main className="page">
        {/* Hero */}
        <div className="hero">
          <div className="hero-eyebrow animate-in">AI-Powered ATS Screening</div>
          <h1 className="animate-in">
            Know exactly why<br />
            you're getting <span className="grad">rejected</span>
          </h1>
          <p className="animate-in">
            Upload your resume, paste any job description — get an instant ATS score,
            missing keywords, and actionable improvements in seconds.
          </p>
          <div className="stats animate-in">
            <div className="stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">ATS Accuracy</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">&lt;10s</span>
              <span className="stat-label">Analysis Time</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">Free</span>
              <span className="stat-label">No Sign Up</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card animate-in" ref={formRef}>

          {/* Upload */}
          <div className="field-label">Step 1 — Upload Resume</div>
          <div
            className={`upload-zone ${dragOver ? "drag" : ""} ${resume ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setResume(e.target.files[0])}
            />
            <div className="upload-icon">
              {resume ? "✅" : "📄"}
            </div>
            {resume ? (
              <>
                <div className="upload-title">Resume Uploaded</div>
                <div className="upload-filename">{resume.name}</div>
                <div className="upload-sub" style={{ marginTop: 6 }}>Click to change file</div>
              </>
            ) : (
              <>
                <div className="upload-title">Drop your resume here</div>
                <div className="upload-sub">or click to browse — PDF only</div>
              </>
            )}
          </div>

          {/* JD */}
          <div className="field-label">Step 2 — Paste Job Description</div>
          <textarea
            className="jd-area"
            placeholder="Paste the full job description here — the more detail, the better your analysis..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />

          {/* Error */}
          {error && <div className="error-msg">⚠️ {error}</div>}

          {/* CTA */}
          <button
            className="btn-analyze"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" />Analyzing your resume...</>
            ) : (
              "Analyze My Resume →"
            )}
          </button>

          {/* Features */}
          <div className="features">
            <div className="feature-item"><span>🔒</span><span>Private — not stored</span></div>
            <div className="feature-item"><span>⚡</span><span>Instant results</span></div>
            <div className="feature-item"><span>🎯</span><span>ATS keyword match</span></div>
          </div>
        </div>
      </main>
    </>
  );
}
