

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

/**
 * formatDisplayDate(dateString, type)
 * - For Education: returns only year (e.g. "2022")
 * - For others: returns "MMM yyyy" (e.g. "Jan 2022")
 */
const formatDisplayDate = (dateString, type) => {
  if (!dateString) return "";
  // If education and user passed year like "2022" already, return as-is
  if (type === "Education") {
    // Accept "YYYY" or "YYYY-MM" or "YYYY-MM-DD" or numeric year
    // Try to parse YYYY-MM first
    if (/^\d{4}$/.test(dateString)) return dateString;
    // if format has month (yyyy-MM) parse and return year
    try {
      const date = parse(dateString, "yyyy-MM", new Date());
      if (!isNaN(date)) return format(date, "yyyy");
    } catch (e) {
      // fallback
    }
    const parsed = new Date(dateString);
    if (!isNaN(parsed)) return String(parsed.getFullYear());
    return dateString;
  }

  // default: month + year
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    if (!isNaN(date)) return format(date, "MMM yyyy");
  } catch (e) {
    // fallback to Date parse
  }
  const parsed = new Date(dateString);
  if (!isNaN(parsed)) return format(parsed, "MMM yyyy");
  return dateString;
};

export function EntryForm({ type, entries = [], onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  // Use zod resolver for validation for non-projects; keep default schema usage
  const resolver = type === "Projects" ? undefined : zodResolver(entrySchema);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver,
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      year: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    // Format dates depending on type
    const formattedEntry = { ...data };

    if (type === "Education") {
      // Expect education startDate/endDate to be year-only (e.g. "2022") — keep as-is
      // But also support month input if present — convert to year
      formattedEntry.startDate = formatDisplayDate(data.startDate, "Education");
      formattedEntry.endDate = data.current ? "" : formatDisplayDate(data.endDate, "Education");
    } else if (type === "Projects") {
      // Projects: keep fields as-is (title, year, description)
      // Nothing special to format
    } else {
      // Experience / other types: keep month+year formatting
      formattedEntry.startDate = formatDisplayDate(data.startDate, "Experience");
      formattedEntry.endDate = data.current ? "" : formatDisplayDate(data.endDate, "Experience");
    }

    onChange([...(entries || []), formattedEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = (entries || []).filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const { loading: isImproving, fn: improveWithAIFn, data: improvedContent, error: improveError } =
    useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }
    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {(entries || []).map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {type === "Projects"
                  ? `${item.title}${item.year ? ` (${item.year})` : ""}`
                  : `${item.title} @ ${item.organization}`}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              {/* Show dates */}
              {type !== "Projects" ? (
                <p className="text-sm text-muted-foreground">
                  {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                </p>
              ) : (
                item.year && <p className="text-sm text-muted-foreground">{item.year}</p>
              )}

              <p className="mt-2 text-sm whitespace-pre-wrap">
                {type === "Education" ? `Percentage: ${item.description || ""}` : item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {type === "Projects" ? (
              // Projects: Project Title, Year, Description (unchanged)
              <>
                <div className="space-y-2">
                  <Input placeholder="Project Title" {...register("title")} />
                </div>

                <div className="space-y-2">
                  <Input placeholder="Year (e.g. 2024)" {...register("year")} />
                </div>

                <div className="space-y-2">
                  <Textarea placeholder="Project description" className="h-32" {...register("description")} />
                </div>
              </>
            ) : (
              // Experience / Education: For Education we use year-only inputs
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      placeholder={type === "Education" ? "Studies" : "Title/Position"}
                      {...register("title")}
                      error={errors.title}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder={type === "Education" ? "University" : "Organization/Company"}
                      {...register("organization")}
                      error={errors.organization}
                    />
                    {errors.organization && <p className="text-sm text-red-500">{errors.organization?.message}</p>}
                  </div>
                </div>

                {/* Dates:
                    - For Education: year-only numeric inputs (type="number")
                    - For others: month picker (type="month")
                */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {type === "Education" ? (
                      <Input
                        type="number"
                        placeholder="Start Year (e.g. 2020)"
                        {...register("startDate")}
                        error={errors.startDate}
                      />
                    ) : (
                      <Input type="month" {...register("startDate")} error={errors.startDate} />
                    )}
                    {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    {type === "Education" ? (
                      <Input
                        type="number"
                        placeholder="End Year (e.g. 2024)"
                        {...register("endDate")}
                        disabled={current}
                        error={errors.endDate}
                      />
                    ) : (
                      <Input type="month" {...register("endDate")} disabled={current} error={errors.endDate} />
                    )}
                    {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="current"
                    {...register("current")}
                    onChange={(e) => {
                      setValue("current", e.target.checked);
                      if (e.target.checked) setValue("endDate", "");
                    }}
                  />
                  <label htmlFor="current">Current {type}</label>
                </div>

                <div className="space-y-2">
                  {type === "Education" ? (
                    <Input placeholder="Percentage" {...register("description")} error={errors.description} />
                  ) : (
                    <Textarea placeholder={`Description of your ${type.toLowerCase()}`} className="h-32" {...register("description")} error={errors.description} />
                  )}
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                {type !== "Education" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleImproveDescription}
                    disabled={isImproving || !watch("description")}
                  >
                    {isImproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Improving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" /> Improve with AI
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button className="w-full" variant="outline" onClick={() => setIsAdding(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add {type}
        </Button>
      )}
    </div>
  );
}
