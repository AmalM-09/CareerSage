import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes ",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Personalized Skill Assessment",
    description:
      "Get AI-powered skill recommendations to grow your career.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
