"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm, Resolver, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobPostSchema } from "@/schemas";
import { createJob } from "@/actions/employer/create-job";
import { updateJob } from "@/actions/employer/update-job";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  CheckCircle2,
  Save,
  Globe,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { JobBasicInfo } from "@/components/employer/job-steps/job-basic-info";
import { JobRequirements } from "@/components/employer/job-steps/job-requirements";
import { JobProjectDetails } from "@/components/employer/job-steps/job-project-details";
import { JobCompensation } from "@/components/employer/job-steps/job-compensation";
import { JobReview } from "@/components/employer/job-steps/job-review";
import { Job } from "@prisma/client";

const STEPS = [
  { id: 1, title: "Basic Info", description: "Job title and description" },
  { id: 2, title: "Requirements", description: "Skills and qualifications" },
  { id: 3, title: "Project Details", description: "Location and timeline" },
  { id: 4, title: "Compensation", description: "Salary and benefits" },
  { id: 5, title: "Review", description: "Final review" },
];

type FormValues = z.infer<typeof JobPostSchema>;

interface CreateJobFormProps {
  initialData?: Job | null;
}

export const CreateJobForm = ({ initialData }: CreateJobFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(JobPostSchema) as Resolver<FormValues>,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      positions: initialData?.positions || 1,
      roleDescription: initialData?.roleDescription || "",
      skills: initialData?.skills || [],
      minAge: initialData?.minAge || 18,
      maxAge: initialData?.maxAge || 60,
      gender: initialData?.gender || "ANY",
      ethnicity: initialData?.ethnicity || "ANY",
      location: initialData?.location || "",
      projectType: initialData?.projectType || "",
      duration: initialData?.duration || "",
      startDate: initialData?.startDate || undefined,
      isPaid: initialData?.isPaid ?? true,
      salaryMin: initialData?.salaryMin || undefined,
      salaryMax: initialData?.salaryMax || undefined,
      currency: initialData?.currency || "NGN",
      deadline: initialData?.deadline || undefined,
      auditionDetails: initialData?.auditionDetails || "",
      isFeatured: initialData?.isFeatured || false,
      status: (initialData?.status as "DRAFT" | "PUBLISHED") || "DRAFT",
    },
    mode: "onChange",
  });

  const handleGlobalSubmit = (targetStatus: "DRAFT" | "PUBLISHED") => {
    form.setValue("status", targetStatus);

    setIsLoading(true);

    form.handleSubmit((values) => {
      const action = initialData
        ? updateJob(values, initialData.id)
        : createJob(values);

      action
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setIsLoading(false);
          } else {
            toast.success(
              initialData
                ? `Job ${
                    targetStatus === "PUBLISHED" ? "Published" : "Updated"
                  }!`
                : `Job ${targetStatus === "PUBLISHED" ? "Created" : "Saved"}!`
            );
            router.push("/employer/jobs");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
          setIsLoading(false);
        });
    })();
  };

  const nextStep = async () => {
    let fieldsToValidate: Path<FormValues>[] = [];

    if (currentStep === 1)
      fieldsToValidate = ["title", "description", "category"];
    if (currentStep === 2) fieldsToValidate = ["roleDescription"];
    if (currentStep === 3) fieldsToValidate = ["location", "projectType"];

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      // Mark current step as completed
      setCompletedSteps((prev) => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const canNavigateToStep = (stepId: number) => {
    if (stepId === 1) return true;
    return completedSteps.includes(stepId - 1);
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] mb-1">
                {initialData ? "Edit Job Posting" : "Create New Job Posting"}
              </h1>
              <p className="text-[#6B7280] text-sm">
                Fill in the details to post your job opportunity
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleGlobalSubmit("DRAFT")}
                disabled={isLoading}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Draft
              </Button>

              <Button
                onClick={() => handleGlobalSubmit("PUBLISHED")}
                disabled={isLoading}
                className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                {initialData?.status === "PUBLISHED"
                  ? "Update & Publish"
                  : "Publish Now"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#1E40AF] to-[#3B82F6] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
              Step {currentStep} of {STEPS.length} - {Math.round(progress)}%
              Complete
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step) => {
              const isAccessible = canNavigateToStep(step.id);
              const isCompleted = completedSteps.includes(step.id);

              return (
                <div key={step.id} className="relative">
                  <button
                    type="button"
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                    disabled={isLoading || !isAccessible}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "focus:outline-none",
                      isAccessible &&
                        "focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2",
                      currentStep === step.id
                        ? "bg-[#1E40AF] text-white shadow-md"
                        : isCompleted
                        ? "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 cursor-pointer"
                        : isAccessible
                        ? "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB] cursor-pointer"
                        : "bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold",
                          currentStep === step.id
                            ? "bg-white/20 text-white"
                            : isCompleted
                            ? "bg-[#10B981] text-white"
                            : isAccessible
                            ? "bg-[#E5E7EB] text-[#6B7280]"
                            : "bg-[#E5E7EB] text-[#9CA3AF]"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className="text-xs font-semibold hidden lg:block">
                        {step.title}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs hidden sm:block",
                        currentStep === step.id
                          ? "text-white/80"
                          : isCompleted
                          ? "text-[#10B981]/70"
                          : "text-[#9CA3AF]"
                      )}
                    >
                      {step.description}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="border-[#E5E7EB] shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-[#1E40AF] to-[#3B82F6] h-1" />
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#111827] mb-1">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-sm text-[#6B7280]">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                {currentStep === 1 && <JobBasicInfo form={form} />}
                {currentStep === 2 && <JobRequirements form={form} />}
                {currentStep === 3 && <JobProjectDetails form={form} />}
                {currentStep === 4 && <JobCompensation form={form} />}
                {currentStep === 5 && <JobReview form={form} />}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-[#E5E7EB] mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isLoading}
                    className="text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleGlobalSubmit("PUBLISHED")}
                      disabled={isLoading}
                      className="bg-[#10B981] hover:bg-[#10B981]/90 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Publish Job
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280]">
            Need help?{" "}
            <a
              href="#"
              className="text-[#1E40AF] hover:text-[#1E40AF]/80 font-medium"
            >
              View our guide
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-[#1E40AF] hover:text-[#1E40AF]/80 font-medium"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
