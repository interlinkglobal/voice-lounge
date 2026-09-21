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

/**
 * A single content band. Optional fields carry `| undefined` explicitly so
 * that builders can pass `undefined` through under
 * `exactOptionalPropertyTypes`.
 */
export interface SectionSpec {
  id: string;
  eyebrow?: string | undefined;
  title: string;
  blurb?: string | undefined;
  layout: SectionLayout;
  items?: MediaCardModel[] | undefined;
  variant?: CardVariant | undefined;
  columns?: 2 | 3 | 4 | 5 | 6 | undefined;
  chips?: Array<{ label: string; to?: string | undefined; meta?: string | undefined }> | undefined;
  faq?: Array<{ q: string; a: string }> | undefined;
  stats?: Array<{ k: string; v: string }> | undefined;
  steps?: Array<{ k: string; v: string }> | undefined;
  quote?: { text: string; who: string; role?: string | undefined } | undefined;
  tone?: "default" | "gold" | "ink" | "green" | undefined;
  action?: { label: string; to: string } | undefined;
  body?: ReactNode | undefined;
  /** Sections above the fold render eagerly; the rest stream in on approach. */
  priority?: boolean | undefined;
}
