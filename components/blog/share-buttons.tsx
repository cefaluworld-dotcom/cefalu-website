"use client";

import { Check, Link2, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

/** WhatsApp / X / LinkedIn share + copy-link. */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Share on X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ] as const;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      {links.map(({ label, icon: Icon, href }) => (
        <Button key={label} asChild variant="outline" size="icon" aria-label={label}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon aria-hidden="true" />
          </a>
        </Button>
      ))}
      <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy link">
        {copied ? <Check className="text-success" aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      </Button>
    </div>
  );
}
