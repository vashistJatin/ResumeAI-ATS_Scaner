const express = require("express");
app.use(cors({
  origin: ["https://resume-ai-ats-scaner.vercel.app/", "http://localhost:3000"],
  methods: ["GET", "POST"],
}));
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", analyzeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
