"use client";

import { useEffect } from "react";
import type { Money } from "@/types";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

interface TrackViewProps {
  handle: string;
  title: string;
  thumbnail: string | null;
  price: Money;
}

/** Records a PDP visit into the recently-viewed store. Renders nothing. */
export function TrackView({ handle, title, thumbnail, price }: TrackViewProps) {
  const track = useRecentlyViewedStore((s) => s.track);
  useEffect(() => {
    track({ handle, title, thumbnail, price });
  }, [track, handle, title, thumbnail, price]);
  return null;
}
