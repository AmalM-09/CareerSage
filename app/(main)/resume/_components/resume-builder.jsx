

"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";

import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { resumeSchema } from "@/app/lib/schema";
import { prisma } from "@/lib/prisma";
export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
      certificates: "",
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);






  
// --- CONTACT SECTION ---
const getContactMarkdown = () => {
  const { contactInfo } = formValues;
  const contactParts = [];
  if (contactInfo?.email) contactParts.push(`<b>Email:</b> ${contactInfo.email}`);
  if (contactInfo?.mobile) contactParts.push(`<b>Mobile:</b> ${contactInfo.mobile}`);

  const socials = [];
  if (contactInfo?.linkedin) socials.push(`<b>LinkedIn:</b> ${contactInfo.linkedin}`);
  if (contactInfo?.twitter) socials.push(`<b>GitHub:</b> ${contactInfo.twitter}`);

  return `
  <div align="center" style="font-size:22px; font-weight:700;">
    ${user?.fullName || ""}
  </div>
  <div align="center" style="margin-top:4px;">${contactParts.join(" | ")}</div>
  <div align="center" style="margin-top:6px;">${socials.join(" | ")}</div>
  `;
};

// --- MAIN CONTENT ---
const getCombinedContent = () => {
  const { summary, skills, experience, education, projects, certificates } = formValues;

// // --- SKILLS ---
// const skillsArray = skills
//   ? skills.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
//   : [];
// let skillsMarkdown = "";
// if (skillsArray.length) {
//   const mid = Math.ceil(skillsArray.length / 2);
//   const leftList = skillsArray.slice(0, mid)
//     .map((s) => `<li style="margin-bottom:6px;">${s}</li>`)
//     .join("");
//   const rightList = skillsArray.slice(mid)
//     .map((s) => `<li style="margin-bottom:6px;">${s}</li>`)
//     .join("");

//   skillsMarkdown = `
//   <h2>Skills</h2>
//   <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:20px; align-items:flex-start; margin-top:4px;">
//     <div style="flex:1; min-width:45%;">
//       <ul style="margin:0; padding-left:20px; list-style-type:disc; list-style-position:inside; line-height:1.6;">${leftList}</ul>
//     </div>
//     <div style="flex:1; min-width:45%;">
//       <ul style="margin:0; padding-left:20px; list-style-type:disc; list-style-position:inside; line-height:1.6;">${rightList}</ul>
//     </div>
//   </div>`;
// }

// --- SKILLS ---
const skillsArray = skills
  ? skills.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
  : [];
let skillsMarkdown = "";
if (skillsArray.length) {
  const mid = Math.ceil(skillsArray.length / 2);
  const leftList = skillsArray.slice(0, mid)
    .map((s) => `<li style="margin-bottom:4px;">${s}</li>`)
    .join("");
  const rightList = skillsArray.slice(mid)
    .map((s) => `<li style="margin-bottom:4px;">${s}</li>`)
    .join("");

  skillsMarkdown = `
  <h2>Skills</h2>
  <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:20px; margin-top:4px; align-items:flex-start;">
    <div style="flex:1; min-width:45%;">
      <ul style="margin:0; padding-left:20px; list-style-type:disc; line-height:1.4;">${leftList}</ul>
    </div>
    <div style="flex:1; min-width:45%;">
      <ul style="margin:0; padding-left:20px; list-style-type:disc; line-height:1.4;">${rightList}</ul>
    </div>
  </div>`;
}





  // --- EXPERIENCE ---
  const experienceMarkdown = experience?.length
    ? `<h2>Work Experience</h2>` +
      experience.map((exp) => {
        const dates = exp.startDate
          ? exp.endDate
            ? `${exp.startDate} - ${exp.endDate}`
            : `${exp.startDate} - Present`
          : "";
        const desc =
          exp.description
            ?.split("\n")
            .map((line) => `<li>${line.trim()}</li>`)
            .join("") || "";
        return `
          <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${exp.title}</span><span>${dates}</span>
            </div>
            <div style="font-weight:500; margin-top:2px;">${exp.organization}</div>
            <ul style="margin-top:2px; margin-bottom:0; padding-left:20px;">${desc}</ul>
          </div>`;
      }).join("")
    : "";

  // --- EDUCATION ---
  const educationMarkdown = education?.length
    ? `<h2>Education</h2>` +
      education.map((edu) => {
        const start = edu.startDate || "";
        const end = edu.current ? "Present" : edu.endDate || "";
        const dates = start ? `${start} - ${end}` : "";
        const desc = edu.description ? `<li>Percentage/GPA: ${edu.description}</li>` : "";
        return `
          <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${edu.title}</span><span>${dates}</span>
            </div>
            <div style="font-weight:500; margin-top:2px;">${edu.organization}</div>
            <ul style="margin-top:2px; margin-bottom:0; padding-left:20px;">${desc}</ul>
          </div>`;
      }).join("")
    : "";

  // --- PROJECTS ---
  const projectsMarkdown = projects?.length
    ? `<h2>Projects</h2>` +
      projects.map((proj) => {
        const yearStr = proj.year ? ` (${proj.year})` : "";
        const desc =
          proj.description
            ?.split("\n")
            .map((line) => `<li>${line.trim()}</li>`)
            .join("") || "";
        return `
          <div style="margin-bottom:10px;">
            <div style="font-weight:600;">• ${proj.title}${yearStr}</div>
            <ul style="margin-top:2px; margin-bottom:0; padding-left:20px;">${desc}</ul>
          </div>`;
      }).join("")
    : "";

//--- CERTIFICATES / REMARKS (Two-Column Layout) ---
const certificatesArray = certificates
  ? certificates.split(/[\n,]+/).map((c) => c.trim()).filter(Boolean)
  : [];
let certificatesMarkdown = "";
if (certificatesArray.length) {
  const mid = Math.ceil(certificatesArray.length / 2);
  const leftList = certificatesArray.slice(0, mid).map((c) => `<li><b>${c}</b></li>`).join("");
  const rightList = certificatesArray.slice(mid).map((c) => `<li><b>${c}</b></li>`).join("");

  certificatesMarkdown = `
  <h2>Certificates</h2>
  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px; margin-top:4px;">
    <div style="flex:1; min-width:45%;">
      <ul style="margin:0; padding-left:20px; list-style-type:disc; line-height:1.6;">${leftList}</ul>
    </div>
    <div style="flex:1; min-width:45%;">
      <ul style="margin:0; padding-left:20px; list-style-type:disc; line-height:1.6;">${rightList}</ul>
    </div>
  </div>`;
}

  // --- FINAL COMBINATION ---
  return [
    getContactMarkdown(),
    summary && `<h2>Professional Summary</h2><p>${summary}</p>`,
    skillsMarkdown,
    experienceMarkdown,
    educationMarkdown,
    projectsMarkdown,
    certificatesMarkdown,
  ]
    .filter(Boolean)
    .join("\n\n");
};



  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent || initialContent || "");
    }
  }, [formValues, activeTab]);

  useEffect(() => {
    if (saveResult && !isSaving) toast.success("Resume saved successfully!");
    if (saveError) toast.error(saveError.message || "Failed to save resume");
  }, [saveResult, saveError, isSaving]);

  const [isGenerating, setIsGenerating] = useState(false);

 

// const generatePDF = async () => {
//   setIsGenerating(true);
//   try {
//     const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
//     const element = document.getElementById("resume-pdf");
//     if (!element) return;

//     const clone = element.cloneNode(true);
//     clone.style.width = "210mm";
//     clone.style.minHeight = "auto";
//     clone.style.padding = "18mm";
//     clone.style.backgroundColor = "#fff";
//     clone.style.boxSizing = "border-box";
//     clone.style.overflow = "visible";
//     clone.id = "resume-pdf-clone";

//     document.body.appendChild(clone);

//     // 🔧 Dynamically measure full content height in mm
//     const pxToMm = (px) => px * 0.264583; // conversion factor
//     const fullHeightMm = pxToMm(clone.scrollHeight) + 20; // + margin buffer
//     const pageHeight = Math.max(297, fullHeightMm); // A4 height minimum

//     const opt = {
//       margin: [5, 5, 10, 5],
//       filename: "resume.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: {
//         scale: 2, // sharper render
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         scrollY: 0,
//       },
//       jsPDF: {
//         unit: "mm",
//         format: [215, pageHeight], // ✅ dynamically adjust to fit content
//         orientation: "portrait",
//       },
//     };

//     await html2pdf().set(opt).from(clone).save();
//     document.body.removeChild(clone);
//   } catch (error) {
//     console.error("PDF generation error:", error);
//   } finally {
//     setIsGenerating(false);
//   }
// };



const generatePDF = async () => {
  setIsGenerating(true);
  try {
    const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;
    const element = document.getElementById("resume-pdf");
    if (!element) return;

    const clone = element.cloneNode(true);
    clone.id = "resume-pdf-clone";

    // PDF-safe override
clone.style.backgroundColor = "#ffffff";
clone.style.color = "#252525";
clone.style.fontFamily = "'Atlas', sans-serif";

// Override Tailwind variables that use oklch/lab
clone.querySelectorAll("*").forEach((el) => {
  el.style.setProperty("--background", "#ffffff");
  el.style.setProperty("--foreground", "#252525");
  el.style.setProperty("--card", "#ffffff");
  el.style.setProperty("--card-foreground", "#252525");
  el.style.setProperty("--primary", "#346beb");
  el.style.setProperty("--primary-foreground", "#fefefe");
});


    // Optional: inject PDF CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/resume-pdf.css"; // make sure this path is correct
    clone.appendChild(link);

    document.body.appendChild(clone);

    const opt = {
      margin: [5, 5, 10, 5],
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: [215, 310],
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(clone).save();
    document.body.removeChild(clone);
  } catch (error) {
    console.error("PDF generation error:", error);
  } finally {
    setIsGenerating(false);
  }
};


const onSubmit = async (data) => {
  try {
    const content = getCombinedContent(); // generate final HTML/Markdown
    await saveResume(content);            // server action handles DB
    toast.success("Resume saved successfully!");
  } catch (error) {
    console.error("Error saving resume:", error);
    toast.error(error.message || "Failed to save resume");
  }
};


  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
        <Button
  variant="destructive"
  disabled={isSaving}
  onClick={handleSubmit(onSubmit)} // ✅ trigger form submission manually
  className="transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-red-600"
>
  {isSaving ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
    </>
  ) : (
    <>
      <Save className="h-4 w-4" /> Save
    </>
  )}
</Button>



          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

   
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    GitHub Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://github.com/your-username"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Objective</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                  />
                )}
              />
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Enter skills separated by comma or new line"
                  />
                )}
              />
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Projects"
                    entries={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Certificates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Certificates</h3>
              <Controller
                name="certificates"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your certificates..."
                  />
                )}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" /> Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" /> Show Preview
                </>
              )}
            </Button>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>

          <div className="hidden">
            {/* The element targeted by html2pdf */}
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{ background: "white", color: "black" }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}













