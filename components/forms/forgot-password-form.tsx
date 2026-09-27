"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm({ className }: { className?: string }) {
  const [sent, setSent] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: Values) {
    try {
      await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch {
      /* generic response either way */
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className={className} role="status">
        <span className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          If an account exists for that email, a reset link is on its way. It expires in 15 minutes — check spam too.
        </span>
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="mt-6 w-full" isLoading={form.formState.isSubmitting}>
          Send reset link
        </Button>
      </form>
    </Form>
  );
}
