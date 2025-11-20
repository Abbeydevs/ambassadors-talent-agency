import { useEffect, useRef, useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  saveAction: (values: T) => Promise<{ error?: string; success?: string }>,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const values = form.watch();

  const save = useCallback(async () => {
    console.log("⏳ Auto-saving...");
    const result = await saveAction(values);
    if (result?.success) {
      console.log("✅ Auto-saved");
    }
  }, [values, saveAction]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (form.formState.isDirty) {
        save();
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [values, delay, save, form.formState.isDirty]);
}
