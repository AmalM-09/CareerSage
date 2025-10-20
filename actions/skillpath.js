
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateSkillPath = async ({ currentSkills, targetRole }) => {
  try {
    console.log("🧠 Generating AI Skill Path...");

    const prompt = `
      Generate a personalized skill path in JSON format for:
      - Current Skills: ${currentSkills}
      - Target Role: ${targetRole}

      Include:
      - recommendedSkills (array of 5)
      - learningPath (array of 5)
      - resources (array of 5)
      - personalizedAdvice (string)

      Return ONLY valid JSON (no markdown, no comments).
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    console.log("🔹 Raw AI Output:", text);

    // Clean up Gemini's output
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧩 Cleaned JSON:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message);
      parsed = null;
    }

    // Validate data before sending to frontend
    const finalData = parsed && parsed.recommendedSkills
      ? parsed
      : {
          recommendedSkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
          learningPath: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
          resources: ["Resource 1", "Resource 2", "Resource 3", "Resource 4", "Resource 5"],
          personalizedAdvice: "Follow a general roadmap based on your target role.",
        };

    console.log("✅ Final Data Sent to Frontend:", finalData);

    // Ensure JSON serializable object is returned
    return JSON.parse(JSON.stringify(finalData));

  } catch (err) {
    console.error("💥 Skill Path API Error:", err);
    return {
      recommendedSkills: ["Skill 1","Skill 2","Skill 3","Skill 4","Skill 5"],
      learningPath: ["Step 1","Step 2","Step 3","Step 4","Step 5"],
      resources: ["Resource 1","Resource 2","Resource 3","Resource 4","Resource 5"],
      personalizedAdvice: "Fallback due to server error.",
    };
  }
};

// "use server";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // ✅ Generate & upsert skill path
// export const generateSkillPath = async ({ currentSkills, targetRole }) => {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({ where: { clerkUserId: userId } });
//     if (!user) throw new Error("User not found");

//     const prompt = `
//       Generate a personalized skill path in JSON format for:
//       - Current Skills: ${currentSkills}
//       - Target Role: ${targetRole}
//       - Experience: ${user.experience || 0} years
//       - Age: ${user.age || 0}

//       Include:
//       - recommendedSkills (array of 5)
//       - learningPath (array of 5)
//       - resources (array of 5)
//       - personalizedAdvice (string)

//       Return ONLY valid JSON (no markdown, no comments).
//     `;

//     const result = await model.generateContent(prompt);
//     let text = result.response.text();
//     text = text.replace(/```json/g, "").replace(/```/g, "").trim();

//     let parsed;
//     try { parsed = JSON.parse(text); } catch (e) { parsed = null; }

//     const finalData = parsed?.recommendedSkills ? parsed : {
//       recommendedSkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
//       learningPath: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
//       resources: ["Resource 1", "Resource 2", "Resource 3", "Resource 4", "Resource 5"],
//       personalizedAdvice: "Follow a general roadmap based on your target role.",
//     };

//     // Upsert into DB
//     const skillPath = await db.skillPath.upsert({
//       where: { userId },
//       update: finalData,
//       create: { userId, ...finalData },
//     });

//     return skillPath;

//   } catch (err) {
//     console.error("Skill Path API Error:", err);
//     return {
//       recommendedSkills: ["Skill 1","Skill 2","Skill 3","Skill 4","Skill 5"],
//       learningPath: ["Step 1","Step 2","Step 3","Step 4","Step 5"],
//       resources: ["Resource 1","Resource 2","Resource 3","Resource 4","Resource 5"],
//       personalizedAdvice: "Fallback due to server error.",
//     };
//   }
// };

// // ✅ New: Fetch existing skill path
// export const getSkillPath = async () => {
//   try {
//     const { userId } = await auth();
//     if (!userId) return null;

//     const skillPath = await db.skillPath.findUnique({
//       where: { userId },
//     });

//     return skillPath || null;
//   } catch (err) {
//     console.error("Failed to fetch skill path:", err);
//     return null;
//   }
// };
