"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile").optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;

export function ProfileForm({
  defaults,
  backendOnline,
}: {
  defaults: Values & { email: string };
  backendOnline: boolean;
}) {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: defaults.firstName, lastName: defaults.lastName, phone: defaults.phone ?? "" },
  });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { success: boolean; error?: string };
    if (!data.success) {
      toast.error("Couldn't update profile", { description: data.error });
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input autoComplete="given-name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input autoComplete="family-name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input value={defaults.email} disabled aria-readonly />
          <FormDescription>Email is your sign-in identity and can&apos;t be changed here.</FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile (optional)</FormLabel>
              <FormControl><Input type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={form.formState.isSubmitting} disabled={!backendOnline}>
          Save changes
        </Button>
        {!backendOnline && (
          <p className="text-xs text-muted-foreground">Profile sync activates once the commerce backend is connected.</p>
        )}
      </form>
    </Form>
  );
}
