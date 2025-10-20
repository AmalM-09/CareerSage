import z from "zod";

export const onboardingSchema = z.object({
    industry: z.string({
        required_error:"please select an industry",
    }),
    subindustry: z.string({
        required_error:"please select a specification",
    }),
    bio: z.string().max(500).optional(),
    age: z.number().min(16, "Minimum age is 16").max(100, "Maximum age is 100"),
    experience:z.string()
                .transform((val) => parseInt(val,10))
                .pipe(
                    z.number()
                     .min(0,"Experience must be at least 0 years")
                     .max(50,"Experience cannot exceed 50 years")
                ),
    skills: z.string().transform((val) =>
       val ? val.split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
        : undefined
    )
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  }) .refine((data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

  export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
   percentage: z.string().optional(),
});