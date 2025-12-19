"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeCheck,
  Clock,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { requestVerification } from "@/actions/employer/verification";
import { VerificationRequest } from "@prisma/client";

const formSchema = z.object({
  documentType: z.string().min(1, "Please select a document type"),
  documentUrl: z
    .string()
    .url("Please enter a valid URL (e.g. Google Drive link)"),
});

interface VerificationRequestFormProps {
  currentRequest?: VerificationRequest | null;
  isVerified: boolean;
}

export const VerificationRequestForm = ({
  currentRequest,
  isVerified,
}: VerificationRequestFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      documentUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      requestVerification(values.documentUrl, values.documentType)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  // 1. ALREADY VERIFIED STATE
  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <BadgeCheck className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">
              Verified Company
            </h3>
            <p className="text-green-700">
              Your company has been verified. You now have the blue checkmark!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 2. PENDING STATE
  if (currentRequest?.status === "PENDING") {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">
              Verification Pending
            </h3>
            <p className="text-blue-700 max-w-md mx-auto">
              We are currently reviewing your documents. This process usually
              takes 24-48 hours. You will be notified once approved.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 3. REJECTED OR NEW STATE
  return (
    <div className="space-y-6">
      {currentRequest?.status === "REJECTED" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            Reason:{" "}
            {currentRequest.rejectionReason || "Documents were invalid."} Please
            submit again.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Verification</CardTitle>
          <CardDescription>
            Upload your business registration documents (CAC, Tax ID) to get the
            verified badge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CAC">CAC Registration</SelectItem>
                        <SelectItem value="TAX_ID">
                          Tax Identification Number
                        </SelectItem>
                        <SelectItem value="BUSINESS_LICENSE">
                          Business License
                        </SelectItem>
                        <SelectItem value="OTHER">
                          Other Official Document
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Link</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="https://drive.google.com/file/d/..."
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Please provide a public link to your document (Google
                      Drive, Dropbox, etc).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#1E40AF]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
