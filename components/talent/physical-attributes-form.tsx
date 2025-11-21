"use client";

import * as z from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhysicalAttributesSchema } from "@/schemas";
import { updatePhysicalAttributes } from "@/actions/talent/update-physical";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Loader2 } from "lucide-react";
import { TalentProfile } from "@prisma/client";

type FormValues = z.infer<typeof PhysicalAttributesSchema>;

const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
  { label: "Swahili", value: "Swahili" },
  { label: "Yoruba", value: "Yoruba" },
  { label: "Igbo", value: "Igbo" },
  { label: "Hausa", value: "Hausa" },
  { label: "Zulu", value: "Zulu" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Arabic", value: "Arabic" },
];

interface PhysicalAttributesFormProps {
  initialData?: TalentProfile | null;
}

export const PhysicalAttributesForm = ({
  initialData,
}: PhysicalAttributesFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(PhysicalAttributesSchema) as Resolver<FormValues>,
    defaultValues: {
      height: initialData?.height || undefined,
      weight: initialData?.weight || undefined,
      bodyType: initialData?.bodyType || "",
      eyeColor: initialData?.eyeColor || "",
      hairColor: initialData?.hairColor || "",
      ethnicity: initialData?.ethnicity || "",
      languages: initialData?.languages || [],
    },
    mode: "onChange",
  });

  useAutoSave(form, async (values) => {
    const result = await updatePhysicalAttributes(values);
    return { success: result.success, error: result.error };
  });

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      updatePhysicalAttributes(values)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Attributes saved!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isPending}
                    placeholder="175"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isPending}
                    placeholder="70"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bodyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SLIM">Slim</SelectItem>
                    <SelectItem value="ATHLETIC">Athletic</SelectItem>
                    <SelectItem value="AVERAGE">Average</SelectItem>
                    <SelectItem value="CURVY">Curvy</SelectItem>
                    <SelectItem value="HEAVY">Heavy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ethnicity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ethnicity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AFRICAN">Black / African</SelectItem>
                    <SelectItem value="ASIAN">Asian</SelectItem>
                    <SelectItem value="CAUCASIAN">White / Caucasian</SelectItem>
                    <SelectItem value="HISPANIC">Hispanic / Latino</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eyeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eye Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BROWN">Brown</SelectItem>
                    <SelectItem value="BLUE">Blue</SelectItem>
                    <SelectItem value="GREEN">Green</SelectItem>
                    <SelectItem value="HAZEL">Hazel</SelectItem>
                    <SelectItem value="GREY">Grey</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hairColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hair Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BLACK">Black</SelectItem>
                    <SelectItem value="BROWN">Brown</SelectItem>
                    <SelectItem value="BLONDE">Blonde</SelectItem>
                    <SelectItem value="RED">Red</SelectItem>
                    <SelectItem value="GREY">Grey</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value || []}
                  options={LANGUAGE_OPTIONS}
                  onChange={field.onChange}
                  placeholder="Select languages..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
