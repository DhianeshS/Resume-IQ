import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ai } from "./server/gemini";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "ResumeIQ" });
  });

  // Comprehensive Resume Analysis API with Gemini AI
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, targetJobTitle, jobDescription } = req.body;

      if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
        return res.status(400).json({ error: "Resume text content is required" });
      }

      const prompt = `You are an expert AI Resume Analyzer and Career Counselor specializing in campus placements, internships, and entry-level to executive hiring.
Analyze this resume carefully.

${targetJobTitle ? `Target Job Title / Role: ${targetJobTitle}\n` : ''}
${jobDescription ? `Job Description / Requirements: ${jobDescription}\n` : ''}

Candidate Resume Content:
"""
${resumeText}
"""

Instructions:
1. Candidate Level Identification:
Identify the candidate level as EXACTLY ONE of:
- "Student"
- "Fresh Graduate"
- "Intern"
- "Entry-Level Professional"
- "Experienced Professional"

Customize the ATS evaluation based on the candidate level.
For students, interns, and fresh graduates: evaluate resume completeness, contact info, professional summary/objective, education, CGPA/marks (if present), coursework, technical skills, soft skills, academic/mini/major projects, internship experience, workshops, certifications, hackathons, paper presentations, achievements, leadership, volunteer work, languages, GitHub, LinkedIn, Portfolio, formatting, grammar, readability, and ATS compatibility.

2. Scores (0-100 integers):
- atsScore (Overall ATS Score)
- formattingScore
- grammarScore
- skillsScore
- projectQualityScore
- internshipScore
- certificationScore
- readabilityScore
- keywordMatchScore
- professionalismScore

3. Presence & Links Check:
- hasGithub (boolean - true if GitHub profile link or handle found in text)
- hasLinkedin (boolean - true if LinkedIn profile link found in text)
- hasPortfolio (boolean - true if Portfolio link or personal website found in text)
- missingSections (array of missing recommended sections, e.g., ["GitHub Link", "Certifications", "Projects"])

4. Feedback & Missing Items:
- topStrengths (string[])
- weaknesses (string[])
- missingTechnicalSkills (string[])
- missingSoftSkills (string[])
- missingCertifications (string[])
- missingProjects (string[])
- detectedSkills (string[])
- missingSkills (string[])
- detectedKeywords (string[])
- missingKeywords (string[])
- grammarMistakes (string[])
- formattingSuggestions (string[])
- keywordSuggestions (string[])

5. Detailed Wording & Action Verbs Feedback:
- betterActionVerbs: list of objects { "weakVerbFound": "Assisted", "recommendedReplacement": "Spearheaded", "context": "In project section bullet 1" }
- professionalWordingImprovements: list of objects { "original": "...", "improved": "...", "explanation": "..." }
- projectDescriptionImprovements: list of objects { "projectName": "...", "feedback": "...", "suggestedAdditions": ["..."] }
- internshipDescriptionImprovements: string[]
- professionalSummaryImprovements: string[]

6. Roles & Career Recommendations:
- suggestedRoles: array of suitable job roles for this candidate (e.g. ["Frontend Developer", "Full Stack Developer", "Software Engineer", "AI Engineer", "Data Analyst", etc.])
- recommendedSkillsToLearn: array of skills candidate should learn next
- recommendedCertifications: array of industry certifications candidate should pursue
- recommendedProjectsToBuild: array of objects { "title": "Project Name", "techStack": ["React", "Node.js"], "description": "Brief description of project idea to boost resume" }
- recommendedInterviewTopics: array of topics to prepare for interviews (e.g. ["Data Structures & Algorithms", "System Design", "DBMS & SQL", "React Hooks"])

7. Company-wise ATS Compatibility Estimates:
Provide estimated ATS compatibility for EXACTLY these 10 top companies:
"Google", "Microsoft", "Amazon", "TCS", "Infosys", "Accenture", "Wipro", "Cognizant", "Capgemini", "Zoho"
Each item in companyAtsEstimates must be an object with:
- "company": company name
- "estimatedScore": integer 0-100
- "matchLevel": "High" | "Moderate" | "Low" | "Needs Optimization"
- "reasoning": 1-2 sentence tailored explanation of how well this resume matches that specific company's hiring style and ATS preferences.

8. General Summaries:
- experienceFeedback: string
- projectFeedback: string
- educationFeedback: string
- resumeSummary: string (encouraging, constructive, and actionable)
- improvedResumeTips: string[]

Return everything in strictly valid structured JSON matching this schema:
{
  "resumeTitle": "Candidate Name or Target Role",
  "candidateLevel": "Student",
  "atsScore": 82,
  "formattingScore": 88,
  "grammarScore": 90,
  "skillsScore": 80,
  "projectQualityScore": 85,
  "internshipScore": 75,
  "certificationScore": 70,
  "readabilityScore": 86,
  "keywordMatchScore": 78,
  "professionalismScore": 84,
  "hasGithub": true,
  "hasLinkedin": true,
  "hasPortfolio": false,
  "missingSections": ["Portfolio Website", "Industry Certifications"],
  "detectedSkills": ["JavaScript", "React", "Python"],
  "missingSkills": ["TypeScript", "Docker"],
  "missingTechnicalSkills": ["TypeScript", "Docker", "PostgreSQL"],
  "missingSoftSkills": ["Cross-functional Collaboration", "Agile Methodologies"],
  "detectedKeywords": ["Frontend", "REST APIs", "Git"],
  "missingKeywords": ["State Management", "CI/CD"],
  "topStrengths": ["Strong academic project portfolio", "Clear contact details and formatting"],
  "weaknesses": ["Lack of metric-driven achievement bullets", "Missing online portfolio link"],
  "missingCertifications": ["AWS Certified Cloud Practitioner", "Meta Frontend Developer"],
  "missingProjects": ["Full-Stack Microservices App", "Real-Time Chat Application"],
  "grammarMistakes": ["Inconsistent verb tenses in bullet points"],
  "formattingSuggestions": ["Use bullet points instead of paragraphs in project descriptions"],
  "keywordSuggestions": ["Add keywords like 'TypeScript', 'Jest', 'Agile'"],
  "betterActionVerbs": [
    {
      "weakVerbFound": "Worked on",
      "recommendedReplacement": "Architected",
      "context": "React e-commerce project"
    }
  ],
  "professionalWordingImprovements": [
    {
      "original": "Made a website using React for college project",
      "improved": "Developed a responsive, high-performance web application utilizing React.js and Tailwind CSS",
      "explanation": "Elevates informal tone to professional engineering terminology"
    }
  ],
  "projectDescriptionImprovements": [
    {
      "projectName": "E-Commerce Web App",
      "feedback": "Needs quantifiable results and tech stack details",
      "suggestedAdditions": ["Integrated Stripe API for payments", "Achieved 95+ Google Lighthouse score"]
    }
  ],
  "internshipDescriptionImprovements": [
    "Quantify impact (e.g. 'Reduced page load time by 30%')",
    "Mention specific team tools and methodologies"
  ],
  "professionalSummaryImprovements": [
    "Reframe objective statement into a value proposition focusing on full-stack development skills"
  ],
  "suggestedRoles": [
    "Frontend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer"
  ],
  "recommendedSkillsToLearn": [
    "TypeScript",
    "Next.js",
    "Docker"
  ],
  "recommendedCertifications": [
    "AWS Certified Developer",
    "Meta Front-End Developer Certificate"
  ],
  "recommendedProjectsToBuild": [
    {
      "title": "Real-Time Collaborative Workspace",
      "techStack": ["React", "Node.js", "WebSockets"],
      "description": "Build a multi-user document editor with live sync to demonstrate full-stack capabilities."
    }
  ],
  "recommendedInterviewTopics": [
    "Data Structures & Algorithms (Array, Trees, Dynamic Programming)",
    "Object-Oriented Programming (OOP) & SOLID Principles",
    "DBMS, SQL Queries & Database Indexing",
    "Web Fundamentals (HTTP, REST, CORS, State Management)"
  ],
  "companyAtsEstimates": [
    {
      "company": "Google",
      "estimatedScore": 78,
      "matchLevel": "Moderate",
      "reasoning": "Strong project depth, but needs deeper algorithmic problem-solving indicators and GitHub link."
    },
    {
      "company": "Microsoft",
      "estimatedScore": 82,
      "matchLevel": "High",
      "reasoning": "Solid CS fundamentals and clean structure match Microsoft's early-career candidate criteria."
    },
    {
      "company": "Amazon",
      "estimatedScore": 80,
      "matchLevel": "High",
      "reasoning": "Highlight Amazon Leadership Principles (Customer Obsession, Ownership) in project bullets."
    },
    {
      "company": "TCS",
      "estimatedScore": 90,
      "matchLevel": "High",
      "reasoning": "Excellent match for campus placement requirements and academic credentials."
    },
    {
      "company": "Infosys",
      "estimatedScore": 88,
      "matchLevel": "High",
      "reasoning": "Strong alignment with core software engineering intake criteria."
    },
    {
      "company": "Accenture",
      "estimatedScore": 85,
      "matchLevel": "High",
      "reasoning": "Good balance of technical skills and soft skills."
    },
    {
      "company": "Wipro",
      "estimatedScore": 88,
      "matchLevel": "High",
      "reasoning": "Well-formatted for automated campus hiring filters."
    },
    {
      "company": "Cognizant",
      "estimatedScore": 86,
      "matchLevel": "High",
      "reasoning": "Clear coursework and project presentation."
    },
    {
      "company": "Capgemini",
      "estimatedScore": 84,
      "matchLevel": "High",
      "reasoning": "Solid technical foundation."
    },
    {
      "company": "Zoho",
      "estimatedScore": 85,
      "matchLevel": "High",
      "reasoning": "Zoho values hands-on coding and independent projects over fancy formatting."
    }
  ],
  "experienceFeedback": "Evaluated internship and project experience for impact metrics and technical depth.",
  "projectFeedback": "Academic projects demonstrate good hands-on building experience.",
  "educationFeedback": "Degree and coursework clearly detailed.",
  "resumeSummary": "Encouraging summary highlighting strengths and clear growth roadmap.",
  "improvedResumeTips": ["Actionable tip 1", "Actionable tip 2"]
}

Return ONLY valid JSON. Do not include markdown formatting outside the JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const raw = JSON.parse(cleanJson);

      const candidateLevel = ["Student", "Fresh Graduate", "Intern", "Entry-Level Professional", "Experienced Professional"].includes(raw.candidateLevel)
        ? raw.candidateLevel
        : "Student";

      // 10 Scores normalization
      const atsScore = Math.min(100, Math.max(0, Number(raw.atsScore) || 75));
      const formattingScore = Math.min(100, Math.max(0, Number(raw.formattingScore) || 80));
      const grammarScore = Math.min(100, Math.max(0, Number(raw.grammarScore) || 85));
      const skillsScore = Math.min(100, Math.max(0, Number(raw.skillsScore) || 80));
      const projectQualityScore = Math.min(100, Math.max(0, Number(raw.projectQualityScore) || 82));
      const internshipScore = Math.min(100, Math.max(0, Number(raw.internshipScore) || 75));
      const certificationScore = Math.min(100, Math.max(0, Number(raw.certificationScore) || 70));
      const readabilityScore = Math.min(100, Math.max(0, Number(raw.readabilityScore) || 82));
      const keywordMatchScore = Math.min(100, Math.max(0, Number(raw.keywordMatchScore) || 78));
      const professionalismScore = Math.min(100, Math.max(0, Number(raw.professionalismScore) || 80));

      const detectedSkills = Array.isArray(raw.detectedSkills) ? raw.detectedSkills : [];
      const missingSkills = Array.isArray(raw.missingSkills) ? raw.missingSkills : [];
      const missingTechnicalSkills = Array.isArray(raw.missingTechnicalSkills) ? raw.missingTechnicalSkills : missingSkills;
      const missingSoftSkills = Array.isArray(raw.missingSoftSkills) ? raw.missingSoftSkills : [];
      const detectedKeywords = Array.isArray(raw.detectedKeywords) ? raw.detectedKeywords : [];
      const missingKeywords = Array.isArray(raw.missingKeywords) ? raw.missingKeywords : [];

      const hasGithub = typeof raw.hasGithub === 'boolean' ? raw.hasGithub : /github\.com/i.test(resumeText);
      const hasLinkedin = typeof raw.hasLinkedin === 'boolean' ? raw.hasLinkedin : /linkedin\.com/i.test(resumeText);
      const hasPortfolio = typeof raw.hasPortfolio === 'boolean' ? raw.hasPortfolio : /(portfolio|website|github\.io|\.dev)/i.test(resumeText);

      const missingSections = Array.isArray(raw.missingSections) ? raw.missingSections : [];

      const topStrengths = Array.isArray(raw.topStrengths) ? raw.topStrengths : [];
      const weaknesses = Array.isArray(raw.weaknesses) ? raw.weaknesses : [];
      const missingCertifications = Array.isArray(raw.missingCertifications) ? raw.missingCertifications : [];
      const missingProjects = Array.isArray(raw.missingProjects) ? raw.missingProjects : [];

      const grammarMistakes = Array.isArray(raw.grammarMistakes) ? raw.grammarMistakes : [];
      const formattingSuggestions = Array.isArray(raw.formattingSuggestions) ? raw.formattingSuggestions : [];
      const keywordSuggestions = Array.isArray(raw.keywordSuggestions) ? raw.keywordSuggestions : [];

      const betterActionVerbs = Array.isArray(raw.betterActionVerbs) ? raw.betterActionVerbs : [];
      const professionalWordingImprovements = Array.isArray(raw.professionalWordingImprovements) ? raw.professionalWordingImprovements : [];
      const projectDescriptionImprovements = Array.isArray(raw.projectDescriptionImprovements) ? raw.projectDescriptionImprovements : [];
      const internshipDescriptionImprovements = Array.isArray(raw.internshipDescriptionImprovements) ? raw.internshipDescriptionImprovements : [];
      const professionalSummaryImprovements = Array.isArray(raw.professionalSummaryImprovements) ? raw.professionalSummaryImprovements : [];

      const suggestedRoles = Array.isArray(raw.suggestedRoles) ? raw.suggestedRoles : ["Software Engineer", "Full Stack Developer", "Frontend Developer"];
      const recommendedSkillsToLearn = Array.isArray(raw.recommendedSkillsToLearn) ? raw.recommendedSkillsToLearn : [];
      const recommendedCertifications = Array.isArray(raw.recommendedCertifications) ? raw.recommendedCertifications : [];
      const recommendedProjectsToBuild = Array.isArray(raw.recommendedProjectsToBuild) ? raw.recommendedProjectsToBuild : [];
      const recommendedInterviewTopics = Array.isArray(raw.recommendedInterviewTopics) ? raw.recommendedInterviewTopics : [];

      // Company estimates default array for top 10 companies
      const defaultCompanies = [
        "Google", "Microsoft", "Amazon", "TCS", "Infosys",
        "Accenture", "Wipro", "Cognizant", "Capgemini", "Zoho"
      ];

      const rawCompaniesMap = new Map();
      if (Array.isArray(raw.companyAtsEstimates)) {
        raw.companyAtsEstimates.forEach((item: any) => {
          if (item && item.company) {
            rawCompaniesMap.set(item.company.toLowerCase(), item);
          }
        });
      }

      const companyAtsEstimates = defaultCompanies.map((c) => {
        const existing = rawCompaniesMap.get(c.toLowerCase());
        if (existing) {
          return {
            company: c,
            estimatedScore: Math.min(100, Math.max(0, Number(existing.estimatedScore) || 80)),
            matchLevel: ["High", "Moderate", "Low", "Needs Optimization"].includes(existing.matchLevel)
              ? existing.matchLevel
              : "High",
            reasoning: existing.reasoning || `Tailored ATS parsing evaluation for ${c}.`,
          };
        }
        return {
          company: c,
          estimatedScore: Math.min(100, Math.max(0, atsScore + (c === 'TCS' || c === 'Infosys' ? 5 : -5))),
          matchLevel: atsScore >= 80 ? "High" : atsScore >= 60 ? "Moderate" : "Needs Optimization",
          reasoning: `Analysis based on ${c}'s typical entry-level and campus recruiting parameters.`,
        };
      });

      const experienceFeedback = raw.experienceFeedback || "Work and internship experience evaluated.";
      const projectFeedback = raw.projectFeedback || "Project portfolio evaluated.";
      const educationFeedback = raw.educationFeedback || "Educational qualifications evaluated.";
      const resumeSummary = raw.resumeSummary || "Constructive evaluation of candidate resume.";
      const improvedResumeTips = Array.isArray(raw.improvedResumeTips) ? raw.improvedResumeTips : [];

      const processedAnalysis = {
        resumeTitle: raw.resumeTitle || targetJobTitle || "Resume Evaluation",
        resumeText,
        targetJobTitle,
        candidateLevel,

        // 10 Detailed Scores
        atsScore,
        formattingScore,
        grammarScore,
        skillsScore,
        projectQualityScore,
        internshipScore,
        certificationScore,
        readabilityScore,
        keywordMatchScore,
        professionalismScore,

        // Profile links & sections
        hasGithub,
        hasLinkedin,
        hasPortfolio,
        missingSections,

        // Skills & Keywords
        detectedSkills,
        missingSkills,
        missingTechnicalSkills,
        missingSoftSkills,
        detectedKeywords,
        missingKeywords,

        // Feedback & Missing Items
        topStrengths,
        weaknesses,
        missingCertifications,
        missingProjects,

        grammarMistakes,
        formattingSuggestions,
        keywordSuggestions,

        betterActionVerbs,
        professionalWordingImprovements,
        projectDescriptionImprovements,
        internshipDescriptionImprovements,
        professionalSummaryImprovements,

        // Recommendations
        suggestedRoles,
        recommendedSkillsToLearn,
        recommendedCertifications,
        recommendedProjectsToBuild,
        recommendedInterviewTopics,

        // Company ATS Estimates
        companyAtsEstimates,

        // Summaries
        experienceFeedback,
        projectFeedback,
        educationFeedback,
        resumeSummary,
        improvedResumeTips,

        // Backward compatibility fields
        overallScore: atsScore,
        keywordScore: keywordMatchScore,
        impactScore: readabilityScore,
        summary: resumeSummary,
        strengths: topStrengths,
        keySkillsFound: detectedSkills,

        createdAt: new Date().toISOString(),
      };

      return res.json(processedAnalysis);
    } catch (error: any) {
      console.error("Error analyzing resume:", error);
      return res.status(500).json({ error: error?.message || "Failed to analyze resume with AI" });
    }
  });

  // AI Cover Letter Generator API
  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { resumeText, targetJobTitle, companyName, jobDescription, tone } = req.body;

      if (!targetJobTitle || !companyName) {
        return res.status(400).json({ error: "Target job title and company name are required" });
      }

      const letterTone = tone || "Professional";

      const prompt = `You are a world-class executive career coach and recruitment expert.
Generate an exceptionally compelling, ATS-optimized, and customized cover letter tailored for the following job application:

Target Role: ${targetJobTitle}
Target Company Name: ${companyName}
Desired Tone: ${letterTone}
${jobDescription ? `Job Description & Requirements:\n${jobDescription}\n` : ""}
${resumeText ? `Candidate Resume Context:\n${resumeText}\n` : ""}

Instructions:
1. Write a clear, punchy, and persuasive cover letter text (4-5 paragraphs max).
2. Highlight key achievements, skills, and value proposition relevant to ${companyName}.
3. Tone should be ${letterTone}, confident, and professional.
4. Include a direct email subject line, formal salutation, 3 bulleted key highlights, and a strong closing call to action.

Return structured JSON strictly adhering to this format:
{
  "subjectLine": "Application for ${targetJobTitle} - [Candidate Name]",
  "salutation": "Dear Hiring Team at ${companyName},",
  "coverLetterText": "Full text of the cover letter with proper spacing and paragraphs...",
  "keyHighlights": [
    "Highlight 1 relevant to target role",
    "Highlight 2 demonstrating quantifiable achievement",
    "Highlight 3 showcasing alignment with company tech stack"
  ],
  "callToAction": "Thank you for your time and consideration. I welcome the opportunity to discuss how my background aligns with your team's goals."
}

Return ONLY valid JSON with no markdown block formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        coverLetterText: parsed.coverLetterText || "Dear Hiring Manager,\n\nI am writing to express my strong interest in the " + targetJobTitle + " position at " + companyName + "...",
        subjectLine: parsed.subjectLine || `Application for ${targetJobTitle} - ${companyName}`,
        salutation: parsed.salutation || `Dear Hiring Manager at ${companyName},`,
        keyHighlights: Array.isArray(parsed.keyHighlights) ? parsed.keyHighlights : ["Proven track record of delivering high quality code", "Strong technical background and problem solving skills"],
        callToAction: parsed.callToAction || "I look forward to discussing my application further.",
        companyName,
        targetJobTitle,
      });
    } catch (error: any) {
      console.error("Error generating cover letter:", error);
      return res.status(500).json({ error: error?.message || "Failed to generate cover letter with AI" });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResumeIQ Express server running on port ${PORT}`);
  });
}

startServer();
