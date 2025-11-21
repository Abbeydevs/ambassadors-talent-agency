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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

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

  // This hook manages the dynamic list
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl"
      >
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="relative overflow-hidden border-l-4 border-l-[#1E40AF]"
            >
              <CardContent className="pt-6">
                {/* Remove Button */}
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Project Title */}
                  <FormField
                    control={form.control}
                    name={`experience.${index}.projectTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="The Lion King"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name={`experience.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role / Character</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Lead Actor - Simba"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Production Company */}
                  <FormField
                    control={form.control}
                    name={`experience.${index}.productionCompany`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Production Company</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="Disney / ABC"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Year */}
                  <FormField
                    control={form.control}
                    name={`experience.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            placeholder="2023"
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isPending}
                          placeholder="Details about the role..."
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center p-10 border-2 border-dashed rounded-lg bg-slate-50 text-muted-foreground">
            <p>No experience added yet.</p>
            <p className="text-sm">Add your past work to build credibility.</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full border-dashed"
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
          <Plus className="mr-2 h-4 w-4" />
          Add Another Credit
        </Button>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="bg-[#1E40AF]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
