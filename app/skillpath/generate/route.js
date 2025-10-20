"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const FALLBACK_DATA = {
  recommendedSkills: [
    "Skill 1: Core Fundamentals",
    "Skill 2: Essential Tooling",
    "Skill 3: Project-Based Learning",
    "Skill 4: Advanced Concepts",
    "Skill 5: Portfolio Polish",
  ],
  learningPath: [
    "Step 1: Complete introductory course.",
    "Step 2: Build a basic guided project.",
    "Step 3: Dive into official documentation.",
    "Step 4: Create a unique capstone project.",
    "Step 5: Practice interview-style challenges.",
  ],
  resources: [
    "Resource 1: Official Docs",
    "Resource 2: Top-Rated Online Course",
    "Resource 3: Industry Best Practices Guide",
    "Resource 4: GitHub Project Template",
    "Resource 5: Networking Event/Mentor",
  ],
  personalizedAdvice: "A system error occurred. Please check the server console for details on the API failure.",
};

export const POST = async (req) => {
  try {
    const { currentSkills, targetRole } = await req.json();
    console.log("This is from guid")

    const prompt = `
      You are an AI career coach. Generate a personalized skill path for:
      - Current Skills: ${currentSkills}
      - Target Role: ${targetRole}

      Provide insights ONLY in the following strict JSON format. DO NOT include any markdown or commentary.

      {
        "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
        "learningPath": ["step1", "step2", "step3", "step4", "step5"],
        "resources": ["resource1", "resource2", "resource3", "resource4", "resource5"],
        "personalizedAdvice": "string"
      }

      Return ONLY the valid JSON object.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```(?:json)?\s*|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("AI Parsing Failed:", parseError);
      return new Response(JSON.stringify({ ...FALLBACK_DATA, personalizedAdvice: "AI Parsing Failed, fallback used." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the AI-generated data
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Skill Path API Error:", err);
    return new Response(JSON.stringify({ ...FALLBACK_DATA, personalizedAdvice: `Critical API error: ${err.message}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
