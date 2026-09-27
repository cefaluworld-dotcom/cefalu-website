"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function AnnouncementBar() {
  const [dismissed, setDismissed, hydrated] = useLocalStorage(
    STORAGE_KEYS.announcementDismissed,
    false
  );

  if (!hydrated) return null;

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden bg-brand-800 text-white"
          role="region"
          aria-label="Announcement"
        >
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2.5 text-center">
            <Link
              href={siteConfig.announcement.href}
              className="text-xs font-medium tracking-wide underline-offset-4 hover:underline sm:text-sm"
            >
              {siteConfig.announcement.message}
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss announcement"
              className="absolute right-3 rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
