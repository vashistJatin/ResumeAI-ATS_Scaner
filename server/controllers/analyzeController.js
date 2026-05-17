const extractText = require("../utils/pdfParser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (req, res) => {
  try {
    const resumeBuffer = req.file.buffer;
    const jobDescription = req.body.jobDescription;

    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract text from PDF
    const resumeText = await extractText(resumeBuffer);

    // Gemini prompt
    const prompt = `
You are an expert ATS system and senior hiring manager.
Analyze the resume against the job description below.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "score": <number between 0 and 100>,
  "matchedKeywords": [<array of matched skills and keywords>],
  "missingKeywords": [<array of important missing skills and keywords>],
  "strengths": [<array of 2 to 3 strong points of the resume>],
  "improvements": [<array of 3 to 4 specific actionable suggestions>],
  "summary": "<2 sentence overall verdict>"
}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);

  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
};

module.exports = { analyzeResume };
