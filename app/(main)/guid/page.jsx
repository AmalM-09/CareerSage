
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateSkillPath } from "@/actions/skillpath";
import { Brain, Compass, Rocket, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const skillPathSchema = z.object({
  currentSkills: z.string().min(2, "Enter at least one current skill"),
  targetRole: z.string().min(2, "Enter your target job/goal"),
});

export default function SkillPathPage() {
  const [result, setResult] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillPathSchema),
  });

  const onSubmit = async (values) => {
    toast.loading("⏳ Generating your skill path...");
    try {
      const data = await generateSkillPath(values);
      console.log("📦 Received from server:", data);

      if (!data) throw new Error("Empty response");

      setResult(data);
      toast.success("✅ Skill Path Generated!");
    } catch (err) {
      console.error("❌ Error in frontend:", err);
      toast.error("Failed to generate skill path");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-background">
      <Card className="w-full max-w-3xl shadow-xl border border-muted rounded-2xl mx-2">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2 text-amber-50">
            <Compass className="text-amber-400" /> Skill Path Guidance
          </CardTitle>
          <CardDescription>
            Enter your current knowledge and target goal to get a personalized learning roadmap.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="currentSkills">Your Current Skills</Label>
              <Textarea
                id="currentSkills"
                placeholder="e.g., HTML, CSS, JavaScript"
                {...register("currentSkills")}
              />
              {errors.currentSkills && (
                <p className="text-sm text-red-500">{errors.currentSkills.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="targetRole">Target Role or Goal</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Frontend Developer, Data Scientist"
                {...register("targetRole")}
              />
              {errors.targetRole && (
                <p className="text-sm text-red-500">{errors.targetRole.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              🚀 Generate Skill Path
            </Button>
          </form>

       {result && (
  <motion.div
    className="mt-10 space-y-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Recommended Skills */}
    <Card className="border-2 border-amber-400/50 bg-amber-50/10 hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-2">
        <Brain className="text-amber-400" />
        <CardTitle className="text-white">Recommended Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {result.recommendedSkills?.map((skill, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, y: -3 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <Badge className="bg-amber-200 text-gray-900 font-semibold px-3 py-1 text-sm shadow-sm">
              {skill}
            </Badge>
          </motion.div>
        ))}
      </CardContent>
    </Card>

    {/* Learning Path */}
    <Card className="border-2 border-blue-400/50 bg-blue-950/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-2">
        <GraduationCap className="text-blue-400" />
        <CardTitle className="text-blue-100">Learning Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {result.learningPath?.map((step, i) => {
          if (typeof step === "object") {
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-md border bg-background/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-blue-400" />
                  <h3 className="font-semibold text-blue-200">
                    {step.title || `Step ${step.step}`}
                  </h3>
                </div>
                {step.description && (
                  <p className="text-sm text-gray-300">{step.description}</p>
                )}
              </motion.div>
            );
          }

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex gap-2 items-start p-2 bg-background/40 border rounded-md hover:shadow-md transition-all duration-300"
            >
              <CheckCircle2 className="text-blue-400 mt-1" />
              <span className="text-gray-200">{step}</span>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>

    {/* Resources */}
    <Card className="border-2 border-green-400/50 bg-green-950/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-2">
        <BookOpen className="text-green-400" />
        <CardTitle className="text-green-100">Suggested Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 space-y-2">
          {result.resources?.map((r, i) => (
            <motion.li
              key={i}
              whileHover={{ x: 5 }}
              className="text-sm text-green-100 transition-all"
            >
              {typeof r === "string"
                ? r
                : (
                  <>
                    <span className="font-medium">{r.name}</span>{" "}
                    <span className="text-sm text-green-300">({r.type})</span>
                    {r.url && (
                      <a href={r.url} target="_blank" className="text-blue-400 hover:underline ml-2">
                        Visit
                      </a>
                    )}
                  </>
                )
              }
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>

    {/* Personalized Advice */}
    <Card className="border-2 border-purple-400/50 bg-purple-950/20 hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-2">
        <Rocket className="text-purple-400" />
        <CardTitle className="text-purple-100">Personalized Advice</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="italic text-purple-100"
        >
          {result.personalizedAdvice}
        </motion.p>
      </CardContent>
    </Card>
  </motion.div>
)}

        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { generateSkillPath, getSkillPath } from "@/actions/skillpath"; // add getSkillPath
// import { Brain, Compass, Rocket, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";
// import { motion } from "framer-motion";

// const skillPathSchema = z.object({
//   currentSkills: z.string().min(2, "Enter at least one current skill"),
//   targetRole: z.string().min(2, "Enter your target job/goal"),
// });

// export default function SkillPathPage() {
//   const [result, setResult] = useState(null);
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(skillPathSchema),
//   });

//   // ✅ Fetch existing skill path on page load
//   useEffect(() => {
//     const fetchSkillPath = async () => {
//       try {
//         const existing = await getSkillPath();
//         if (existing) setResult(existing);
//       } catch (err) {
//         console.error("Failed to fetch skill path:", err);
//       }
//     };
//     fetchSkillPath();
//   }, []);

//   // ✅ Handle form submission
//   const onSubmit = async (values) => {
//     toast.loading("⏳ Generating your skill path...");
//     try {
//       // Call server action that generates and inserts skill path into DB
//       const data = await generateSkillPath(values);
//       console.log("📦 Received from server:", data);

//       if (!data) throw new Error("Empty response");

//       setResult(data);
//       toast.success("✅ Skill Path Generated and Saved!");
//     } catch (err) {
//       console.error("❌ Error in frontend:", err);
//       toast.error("Failed to generate skill path");
//     } finally {
//       toast.dismiss();
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen py-10 bg-background">
//       <Card className="w-full max-w-3xl shadow-xl border border-muted rounded-2xl mx-2">
//         <CardHeader>
//           <CardTitle className="text-3xl flex items-center gap-2 text-amber-50">
//             <Compass className="text-amber-400" /> Skill Path Guidance
//           </CardTitle>
//           <CardDescription>
//             Enter your current knowledge and target goal to get a personalized learning roadmap.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {/* Form */}
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             <div>
//               <Label htmlFor="currentSkills">Your Current Skills</Label>
//               <Textarea
//                 id="currentSkills"
//                 placeholder="e.g., HTML, CSS, JavaScript"
//                 {...register("currentSkills")}
//               />
//               {errors.currentSkills && (
//                 <p className="text-sm text-red-500">{errors.currentSkills.message}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="targetRole">Target Role or Goal</Label>
//               <Input
//                 id="targetRole"
//                 placeholder="e.g., Frontend Developer, Data Scientist"
//                 {...register("targetRole")}
//               />
//               {errors.targetRole && (
//                 <p className="text-sm text-red-500">{errors.targetRole.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full">
//               🚀 Generate Skill Path
//             </Button>
//           </form>

//           {/* Display Skill Path if exists */}
//           {result && (
//             <motion.div
//               className="mt-10 space-y-6"
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               {/* Recommended Skills */}
//               <Card className="border-2 border-amber-400/50 bg-amber-50/10 hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center gap-2">
//                   <Brain className="text-amber-400" />
//                   <CardTitle className="text-gray-900">Recommended Skills</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-wrap gap-2">
//                   {result.recommendedSkills?.map((skill, i) => (
//                     <motion.div
//                       key={i}
//                       whileHover={{ scale: 1.1, y: -3 }}
//                       transition={{ type: "spring", stiffness: 250 }}
//                     >
//                       <Badge className="bg-amber-200 text-gray-900 font-semibold px-3 py-1 text-sm shadow-sm">
//                         {skill}
//                       </Badge>
//                     </motion.div>
//                   ))}
//                 </CardContent>
//               </Card>

//               {/* Learning Path */}
//               <Card className="border-2 border-blue-400/50 bg-blue-950/20 hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center gap-2">
//                   <GraduationCap className="text-blue-400" />
//                   <CardTitle className="text-blue-100">Learning Roadmap</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   {result.learningPath?.map((step, i) => (
//                     <motion.div
//                       key={i}
//                       whileHover={{ scale: 1.02 }}
//                       className="flex gap-2 items-start p-2 bg-background/40 border rounded-md hover:shadow-md transition-all duration-300"
//                     >
//                       <CheckCircle2 className="text-blue-400 mt-1" />
//                       <span className="text-gray-200">{step}</span>
//                     </motion.div>
//                   ))}
//                 </CardContent>
//               </Card>

//               {/* Resources */}
//               <Card className="border-2 border-green-400/50 bg-green-950/20 hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center gap-2">
//                   <BookOpen className="text-green-400" />
//                   <CardTitle className="text-green-100">Suggested Resources</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ul className="list-disc pl-6 space-y-2">
//                     {result.resources?.map((r, i) => (
//                       <motion.li
//                         key={i}
//                         whileHover={{ x: 5 }}
//                         className="text-sm text-green-100 transition-all"
//                       >
//                         {typeof r === "string" ? r : r.name}
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>

//               {/* Personalized Advice */}
//               <Card className="border-2 border-purple-400/50 bg-purple-950/20 hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center gap-2">
//                   <Rocket className="text-purple-400" />
//                   <CardTitle className="text-purple-100">Personalized Advice</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.8 }}
//                     className="italic text-purple-100"
//                   >
//                     {result.personalizedAdvice}
//                   </motion.p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
