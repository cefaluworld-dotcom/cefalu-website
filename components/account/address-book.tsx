"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

interface AddressRow {
  id: string;
  name: string;
  line: string;
  cityLine: string;
  phone: string;
}

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address1: z.string().min(5, "Enter your street address"),
  address2: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Valid 6-digit PIN"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile"),
});

type Values = z.infer<typeof schema>;

export function AddressBook({
  initialAddresses,
  backendOnline,
}: {
  initialAddresses: AddressRow[];
  backendOnline: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", lastName: "", address1: "", address2: "",
      city: "", state: "", pincode: "", phone: "",
    },
  });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { success: boolean; error?: string };
    if (!data.success) {
      toast.error("Couldn't save address", { description: data.error });
      return;
    }
    toast.success("Address saved");
    form.reset();
    setAdding(false);
    router.refresh();
  }

  async function onDelete(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = (await res.json()) as { success: boolean };
    setBusyId(null);
    if (!data.success) {
      toast.error("Couldn't remove address");
      return;
    }
    toast.success("Address removed");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {initialAddresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
          <MapPin className="size-9 text-muted-foreground" aria-hidden="true" />
          <p className="font-display font-semibold">No saved addresses</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {backendOnline
              ? "Add your first delivery address below."
              : "Address sync activates once the commerce backend is connected."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {initialAddresses.map((a) => (
            <li key={a.id} className="rounded-2xl border bg-card p-5">
              <p className="text-sm font-bold">{a.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.line}</p>
              <p className="text-sm text-muted-foreground">{a.cityLine}</p>
              {a.phone && <p className="mt-1 text-xs text-muted-foreground">📞 {a.phone}</p>}
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 px-0 text-destructive hover:text-destructive"
                isLoading={busyId === a.id}
                onClick={() => onDelete(a.id)}
              >
                <Trash2 aria-hidden="true" /> Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      {backendOnline && !adding && (
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus aria-hidden="true" /> Add address
        </Button>
      )}

      {adding && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-card p-6" noValidate>
            <h2 className="font-display text-base font-bold">New address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["firstName", "First name", {}],
                  ["lastName", "Last name", {}],
                  ["address1", "Address line 1", { className: "sm:col-span-2" }],
                  ["address2", "Address line 2 (optional)", { className: "sm:col-span-2" }],
                  ["city", "City", {}],
                  ["state", "State", {}],
                  ["pincode", "PIN code", {}],
                  ["phone", "Mobile", {}],
                ] as const
              ).map(([name, label, opts]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className={"className" in opts ? opts.className : undefined}>
                      <FormLabel>{label}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" isLoading={form.formState.isSubmitting}>Save address</Button>
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
