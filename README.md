# AI Resume Screener

An AI-powered full-stack web application that analyzes resumes against job descriptions and returns an ATS match score with detailed feedback.

## Live Demo
[Add your Vercel link here]

## Features
- Upload resume as PDF
- Paste any job description
- Get an ATS match score out of 100
- See matched and missing keywords
- Get specific improvement suggestions
- Fully responsive UI

## Tech Stack
**Frontend:** Next.js, React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**AI:** Google Gemini 1.5 Flash API  
**PDF Parsing:** pdf-parse  
**Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/ai-resume-screener.git
cd ai-resume-screener
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Run the server:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd client
npx create-next-app@latest . --yes
npm install axios
```

Run the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

## Project Structure
```
ai-resume-screener/
├── client/               # Next.js frontend
│   ├── app/
│   │   ├── page.jsx      # Upload page
│   │   └── results/
│   │       └── page.jsx  # Results page
│   └── tailwind.config.js
│
└── server/               # Express backend
    ├── controllers/
    │   └── analyzeController.js
    ├── routes/
    │   └── analyze.js
    ├── utils/
    │   └── pdfParser.js
    └── index.js
```

## API Reference

### POST /api/analyze
Analyzes a resume against a job description.

**Request:** `multipart/form-data`
- `resume` — PDF file
- `jobDescription` — string

**Response:**
```json
{
  "score": 78,
  "matchedKeywords": ["React.js", "Node.js", "MongoDB"],
  "missingKeywords": ["Docker", "AWS"],
  "strengths": ["Strong MERN stack experience"],
  "improvements": ["Add quantified metrics to bullet points"],
  "summary": "Good match overall with some gaps in DevOps skills."
}
```

## Author
**Jatin Sharma** — [LinkedIn](https://linkedin.com/in/jatin-sharma-8874162b2) · [GitHub](https://github.com/vashistJatin)
