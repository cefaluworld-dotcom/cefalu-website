"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInvoiceButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer aria-hidden="true" /> Download invoice
    </Button>
  );
}
