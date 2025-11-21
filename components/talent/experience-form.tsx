"use client";

import * as z from "zod";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExperienceListSchema } from "@/schemas";
import { updateExperience } from "@/actions/talent/update-experience";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";
import { ExperienceCredit, TalentProfile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Award, Save, CheckCircle2 } from "lucide-react";

type FormValues = z.infer<typeof ExperienceListSchema>;

interface ExperienceFormProps {
  initialData?: (TalentProfile & { experience: ExperienceCredit[] }) | null;
}

export const ExperienceForm = ({ initialData }: ExperienceFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(ExperienceListSchema) as Resolver<FormValues>,
    defaultValues: {
      experience:
        initialData?.experience.map((exp) => ({
          projectTitle: exp.projectTitle,
          role: exp.role,
          year: exp.year,
          productionCompany: exp.productionCompany || "",
          description: exp.description || "",
        })) || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  useAutoSave(form, async (values) => {
    const result = await updateExperience(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updateExperience(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Experience saved!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Experience Cards */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="relative overflow-hidden border-2 hover:border-green-200 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-green-500 to-emerald-500"></div>

              <CardContent className="pt-6 pl-8">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-md">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Credit #{index + 1}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Past work experience
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Row 1: Project Title & Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.projectTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Project Title *
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="e.g. The Lion King"
                              className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Role / Character *
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="e.g. Lead Actor - Simba"
                              className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Production Company & Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.productionCompany`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Production Company
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="e.g. Disney / ABC"
                              className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Year *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={isPending}
                              placeholder="e.g. 2023"
                              className="h-11 border-gray-300 focus:border-green-600 focus:ring-green-600"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Description (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isPending}
                            placeholder="Details about the role, achievements, or notable aspects..."
                            className="resize-none h-24 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Add any additional details about this project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-linear-to-br from-gray-50 to-green-50/30">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-green-100 to-emerald-100 mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No experience added yet
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Add your past work to build credibility and showcase your
              professional journey. Include films, TV shows, theater,
              commercials, and more.
            </p>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50"
              onClick={() =>
                append({
                  projectTitle: "",
                  role: "",
                  year: new Date().getFullYear(),
                  productionCompany: "",
                  description: "",
                })
              }
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Credit
            </Button>
          </div>
        )}

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-green-50 h-14 text-gray-600 hover:text-green-600 transition-all"
            onClick={() =>
              append({
                projectTitle: "",
                role: "",
                year: new Date().getFullYear(),
                productionCompany: "",
                description: "",
              })
            }
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Another Credit
          </Button>
        )}

        {fields.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Auto-save enabled</span>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-11 px-8"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
