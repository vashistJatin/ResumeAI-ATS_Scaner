import "./globals.css";

export const metadata = {
  title: "ResumeAI — ATS Resume Screener",
  description:
    "Analyze your resume against any job description and get an instant ATS score.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#080810" }}>
        {children}
      </body>
    </html>
  );
}
