"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password: values.password }),
    });
    const data = (await res.json()) as { success: boolean; error?: string };
    if (!data.success) {
      toast.error("Couldn't reset password", { description: data.error });
      return;
    }
    toast.success("Password updated", { description: "Sign in with your new password." });
    router.push(ROUTES.login);
  }

  if (!token || !email) {
    return (
      <p className={className} role="alert">
        <span className="block rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          This page needs the token from your reset email. Open the link in the email, or request a new one from the
          Forgot Password page.
        </span>
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="Min. 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" isLoading={form.formState.isSubmitting}>
          Update password
        </Button>
      </form>
    </Form>
  );
}
