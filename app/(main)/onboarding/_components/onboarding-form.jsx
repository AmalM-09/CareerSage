// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { onboardingSchema } from "../../../lib/schema";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import useFetch from "../../../../hooks/use-fetch";
// import { updateUser } from "../../../../actions/user";
// import { toast } from "sonner";

// const OnboardingForm = ({ industries }) => {
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const router = useRouter();

//   const {
//     loading: updateLoading,
//     fn: updatedUserFn,
//     data: updateResult,
//   } = useFetch(updateUser);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm({
//     resolver: zodResolver(onboardingSchema),
//   });

//   // const onSubmit = async (values) => {
//   //   try {
//   //     const formattedIndustry = `${values.industry} ${values.subIndustry}`
//   //       .toLowerCase()
//   //       .replace(/ /g, "-");

//   //     await updatedUserFn({
//   //       ...values,
//   //       industry: formattedIndustry,
//   //     });
//   //   } catch (error) {
//   //     console.error("Onboarding error:", error);
//   //   }
//   // };


//   const onSubmit = async (values) => {
//   try {
//     const formattedIndustry = industries.find((ind) => ind.id === values.industry)?.name || "";
//     const subIndustry = values.subindustry || "";

//     await updatedUserFn({
//       ...values,
//       industry: formattedIndustry,
//       subIndustry, // store subindustry in DB if needed
//     });
//   } catch (error) {
//     console.error("Onboarding error:", error);
//   }
// };



//   useEffect(() => {
//     if (updateResult?.success && !updateLoading) {
//       toast.success("Profile Completed Successfully");
//       router.push("/dashboard");
//       router.refresh();
//     }
//   }, [updateLoading, updateResult]);

//   const watchIndustry = watch("industry");

//   return (
//     <div className="flex items-center justify-center bg-background">
//       <Card className="w-full max-w-lg mt-10 mx-2">
//         <CardHeader>
//           <CardTitle className="gradient-title text-4xl text-amber-50">
//             Complete your Profile
//           </CardTitle>
//           <CardDescription>
//             Select your industry to get personalized career insights and recommendations
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             {/* Industry */}
//             <div className="space-y-2">
//               <Label htmlFor="industry"> Industry </Label>
//               <Select
//                 onValueChange={(value) => {
//                   setValue("industry", value);
//                   setSelectedIndustry(industries.find((ind) => ind.id === value));
//                   setValue("subindustry", "");
//                 }}
//               >
//                 <SelectTrigger id="industry">
//                   <SelectValue placeholder="Select an industry" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {industries.map((ind) => (
//                     <SelectItem value={ind.id} key={ind.id}>
//                       {ind.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.industry && (
//                 <p className="text-sm text-red-500">{errors.industry.message}</p>
//               )}
//             </div>

//             {/* Sub Industry */}
//             {watchIndustry && (
//               <div className="space-y-2">
//                 <Label htmlFor="subIndustry"> Specialization </Label>

//                 <Select onValueChange={(value) => setValue("subindustry", value)}>
//                   <SelectTrigger id="subIndustry">
//                     <SelectValue placeholder="Select specialization" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {selectedIndustry?.subIndustries.map((ind) => (
//                       <SelectItem value={ind} key={ind}>
//                         {ind}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {errors.subindustry && (
//                   <p className="text-sm text-red-500">{errors.subindustry.message}</p>
//                 )}
//               </div>
//             )}

//             {/* Experience */}
//             <div className="space-y-2">
//               <Label htmlFor="experience"> Years of Experience </Label>
//               <Input
//                 id="experience"
//                 type="number"
//                 min="0"
//                 max="50"
//                 placeholder="Enter years of experience"
//                 {...register("experience")}
//               />
//               {errors.experience && (
//                 <p className="text-sm text-red-500">{errors.experience.message}</p>
//               )}
//             </div>

//             {/* ✅ Age field added here */}
//             <div className="space-y-2">
//               <Label htmlFor="age"> Age </Label>
//               <Input
//                 id="age"
//                 type="number"
//                 min="16"
//                 max="100"
//                 placeholder="Enter your age"
//                 {...register("age",{ valueAsNumber: true })}
//               />
//               {errors.age && (
//                 <p className="text-sm text-red-500">{errors.age.message}</p>
//               )}
//             </div>

//             {/* Skills */}
//             <div className="space-y-2">
//               <Label htmlFor="skills"> Skills </Label>
//               <Input
//                 id="skills"
//                 placeholder="e.g., Python, JavaScript, etc..."
//                 {...register("skills")}
//               />
//               {errors.skills && (
//                 <p className="text-sm text-red-500">{errors.skills.message}</p>
//               )}
//             </div>

//             {/* Bio */}
//             <div className="space-y-2">
//               <Label htmlFor="bio"> Bio </Label>
//               <Textarea
//                 id="bio"
//                 placeholder="Tell us about your professional background..."
//                 {...register("bio")}
//               />
//               {errors.bio && (
//                 <p className="text-sm text-red-500">{errors.bio.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full">
//               Complete Profile
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OnboardingForm;


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "../../../lib/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "../../../../hooks/use-fetch";
import { updateUser } from "../../../../actions/user";
import { toast } from "sonner";

const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();

  const { loading: updateLoading, fn: updatedUserFn, data: updateResult } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const watchIndustry = watch("industry");

  // Register subindustry with RHF
  useEffect(() => {
    register("subindustry"); 
  }, [register]);

  // const onSubmit = async (values) => {
  //   try {
  //     const industryName = industries.find((ind) => ind.id === values.industry)?.name || "";
  //     const subIndustry = values.subindustry || "";

  //     await updatedUserFn({
  //       ...values,
  //       industry: industryName,
  //       subIndustry, // saved to DB
  //     });
  //   } catch (error) {
  //     console.error("Onboarding error:", error);
  //   }
  // };


 const onSubmit = async (values) => {
  try {
    const industryName = industries.find((ind) => ind.id === values.industry)?.name || "";
    const subIndustry = values.subindustry || "";

    // Combine industry and specialization
    const combinedIndustry = subIndustry ? `${industryName}, ${subIndustry}` : industryName;

    await updatedUserFn({
      ...values,
      industry: combinedIndustry, // saved as "Software, Web"
    });
  } catch (error) {
    console.error("Onboarding error:", error);
  }
};




  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile Completed Successfully");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateLoading, updateResult]);

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl text-amber-50">
            Complete your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and recommendations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry"> Industry </Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(industries.find((ind) => ind.id === value));
                  setValue("subindustry", ""); // reset subindustry
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem value={ind.id} key={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
            </div>

            {/* Sub Industry */}
            {watchIndustry && selectedIndustry?.subIndustries?.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry"> Specialization </Label>
                <Select
                  onValueChange={(value) => setValue("subindustry", value)}
                  value={watch("subindustry") || ""}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>

                  <SelectContent>
                    {selectedIndustry.subIndustries.map((ind) => (
                      <SelectItem value={ind} key={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.subindustry && <p className="text-sm text-red-500">{errors.subindustry.message}</p>}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience"> Years of Experience </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age"> Age </Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="100"
                placeholder="Enter your age"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills"> Skills </Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, etc..."
                {...register("skills")}
              />
              {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio"> Bio </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                {...register("bio")}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
