"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>(
    !token ? "Missing token!" : undefined
  );
  const [success, setSuccess] = useState<string | undefined>();

  const hasMounted = useRef(false);

  useEffect(() => {
    if (success || error || !token) return;

    if (hasMounted.current) return;
    hasMounted.current = true;

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Confirming your verification
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center w-full">
        {!success && !error && <Loader2 className="h-10 w-10 animate-spin" />}
        {success && (
          <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <p>{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full font-normal" asChild>
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
