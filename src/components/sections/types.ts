import type { ReactNode } from "react";
import type { MediaCardModel } from "@/lib/content/types";
import type { CardVariant } from "@/components/media/MediaCard";

export type SectionLayout =
  | "rail"
  | "grid"
  | "ranked"
  | "featured"
  | "chips"
  | "editorial"
  | "split"
  | "cta"
  | "faq"
  | "stats"
  | "schedule"
  | "panel"
  | "quote"
  | "steps"
  | "mosaic";

export interface SectionSpec {
  id: string;
  eyebrow?: string;
  title: string;
  blurb?: string;
  layout: SectionLayout;
  items?: MediaCardModel[];
  variant?: CardVariant;
  columns?: 2 | 3 | 4 | 5 | 6;
  chips?: Array<{ label: string; to?: string; meta?: string }>;
  faq?: Array<{ q: string; a: string }>;
  stats?: Array<{ k: string; v: string }>;
  steps?: Array<{ k: string; v: string }>;
  quote?: { text: string; who: string; role?: string };
  tone?: "default" | "gold" | "ink" | "green";
  action?: { label: string; to: string };
  body?: ReactNode;
  /** Sections above the fold render eagerly; the rest stream in on approach. */
  priority?: boolean;
}
