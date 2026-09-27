"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

/** Danger zone: permanent account deletion with typed confirmation. */
export function DeleteAccountCard() {
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    setBusy(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) {
        toast.error("Couldn't delete account", { description: data.error });
        return;
      }
      toast.success("Account deleted", { description: "We're sorry to see you go." });
      await signOut({ callbackUrl: "/" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <TriangleAlert className="size-4" aria-hidden="true" /> Delete account
        </CardTitle>
        <CardDescription>
          Permanently removes your profile, addresses and sign-in. Order records are retained only
          as required by Indian tax law. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          placeholder='Type "DELETE" to confirm'
          aria-label="Deletion confirmation"
          className="sm:max-w-56"
        />
        <Button
          variant="destructive"
          disabled={confirm !== "DELETE"}
          isLoading={busy}
          onClick={onDelete}
        >
          Permanently delete
        </Button>
      </CardContent>
    </Card>
  );
}
