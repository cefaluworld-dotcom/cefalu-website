"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Leaf, Play, Rotate3d } from "lucide-react";
import type { GalleryMedia } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  media: GalleryMedia[];
  title: string;
}

/** Gallery with hover-zoom, video support and a 360° placeholder tab. */
export function ProductGallery({ media, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement>(null);

  const items: Array<GalleryMedia | { id: "360"; type: "360" }> = [...media, { id: "360", type: "360" }];
  const current = items[Math.min(active, items.length - 1)] ?? items[0];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-square overflow-hidden rounded-2xl border bg-surface"
      >
        {!current || current.type === "360" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Rotate3d className="size-14 text-brand-300" aria-hidden="true" />
            <p className="font-display text-lg font-bold">360° view</p>
            <p className="max-w-xs px-6 text-xs text-muted-foreground">
              Interactive spin coming with our next photoshoot — browse photos and the pack video meanwhile.
            </p>
          </div>
        ) : current.type === "video" ? (
          <video
            key={current.id}
            src={current.url}
            controls
            playsInline
            className="size-full object-cover"
            aria-label={`${title} product video`}
          />
        ) : (
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt ?? `${title} — image ${active + 1}`}
            fill
            priority={active === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover transition-transform duration-150 ease-out",
              zoom ? "scale-[1.8] cursor-zoom-out" : "cursor-zoom-in"
            )}
            style={{ transformOrigin: origin }}
          />
        )}
        {current && current.type === "image" && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-2xs font-semibold text-muted-foreground backdrop-blur">
            Hover to zoom
          </span>
        )}
      </div>

      <ul className="flex gap-2 overflow-x-auto scrollbar-none" aria-label="Product media">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={
                item.type === "360" ? "View 360° tab" : item.type === "video" ? "Play product video" : `View image ${i + 1}`
              }
              aria-current={i === active}
              className={cn(
                "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-surface transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              {item.type === "image" ? (
                <Image src={item.url} alt="" fill sizes="64px" className="object-cover" />
              ) : item.type === "video" ? (
                <Play className="size-5 text-primary" aria-hidden="true" />
              ) : (
                <Rotate3d className="size-5 text-primary" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {media.length === 0 && (
        <p className="sr-only">No product photos available yet</p>
      )}
      {media.length === 0 && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Leaf className="size-16 text-brand-200" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
