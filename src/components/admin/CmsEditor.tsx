import { useMemo, useState } from "react";
import { Eye, GripVertical, ImagePlus, Plus, Save, Search, Settings2, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CmsSlot {
  title: string;
  type: string;
  status: "Live" | "Draft";
  items: number;
}

const DEFAULTS: Record<string, CmsSlot[]> = {
  home: [
    { title: "Trending Now", type: "YouTube rail", status: "Live", items: 10 },
    { title: "Editor's Picks", type: "Curated collection", status: "Live", items: 8 },
    { title: "Featured Podcast", type: "Feature", status: "Live", items: 1 },
    { title: "Browse Categories", type: "Category grid", status: "Live", items: 12 },
    { title: "Most Watched", type: "Video collection", status: "Live", items: 10 },
    { title: "Creator Spotlight", type: "Creator collection", status: "Live", items: 6 },
  ],
  discover: [
    { title: "Discover tabs", type: "Filter configuration", status: "Live", items: 5 },
    { title: "Recommended sources", type: "Mixed collection", status: "Live", items: 12 },
  ],
  podcasts: [
    { title: "Podcast directory", type: "Podcast collection", status: "Live", items: 40 },
    { title: "Featured podcasts", type: "Curated podcast slots", status: "Live", items: 8 },
  ],
  shows: [
    { title: "Show selector", type: "Show collection", status: "Live", items: 6 },
    { title: "Show content mapping", type: "YouTube collection", status: "Draft", items: 8 },
  ],
  watch: [
    { title: "Latest videos", type: "YouTube collection", status: "Live", items: 12 },
    { title: "Most watched", type: "YouTube collection", status: "Live", items: 10 },
  ],
  news: [
    { title: "Featured story", type: "Editorial slot", status: "Live", items: 1 },
    { title: "Latest newsroom", type: "Article collection", status: "Live", items: 10 },
  ],
};

function CmsHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-[clamp(2.4rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.055em]">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{copy}</p>
    </header>
  );
}

export function CmsOverview() {
  const stats = [["Public routes", "24"], ["Managed surfaces", "18"], ["Live sections", "16"], ["Draft changes", "3"]];
  return (
    <div>
      <CmsHeading eyebrow="Website overview" title="Content operations" copy="A front-end control surface for the media team. Supabase persistence, roles and publishing workflows will be connected later." />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => <div key={label} className="rounded-2xl border border-hairline bg-card p-5"><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl border border-hairline bg-card p-5">
          <h2 className="font-display text-xl font-black">Publishing queue</h2>
          <div className="mt-4 grid gap-2">
            {["Editor's Picks refresh", "Home hero copy", "Featured podcast reorder", "Shows collection mapping"].map((label, index) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-hairline bg-surface-2 p-3">
                <span className="text-sm font-semibold">{label}</span>
                <span className={cn("rounded-full px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em]", index < 2 ? "bg-[color-mix(in_oklab,var(--green)_13%,transparent)] text-[var(--green)]" : "bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold)]")}>{index < 2 ? "Ready" : "Draft"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-hairline bg-card p-5">
          <h2 className="font-display text-xl font-black">Backend status</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">This implementation intentionally stops at the interface layer.</p>
          <div className="mt-5 grid gap-2 text-sm">
            {["Supabase content tables", "Admin roles / RLS", "Media uploads", "Draft publishing", "Audit history"].map((item) => <div key={item} className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-[var(--gold)]" />{item}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CmsContentControl({ area }: { area: keyof typeof DEFAULTS }) {
  const [slots, setSlots] = useState(DEFAULTS[area] ?? []);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const current = slots[selected];

  const filtered = useMemo(() => slots.filter((slot) => slot.title.toLowerCase().includes(query.toLowerCase())), [query, slots]);

  function toggle(index: number) {
    setSlots((currentSlots) => currentSlots.map((slot, slotIndex) => slotIndex === index ? { ...slot, status: slot.status === "Live" ? "Draft" : "Live" } : slot));
  }

  return (
    <div>
      <CmsHeading eyebrow="Content control" title={area.slice(0, 1).toUpperCase() + area.slice(1)} copy="Configure visible sections, editorial slots and ordering. Changes in this UI are local drafts until the Supabase CMS backend is connected." />

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4">
          <Search className="size-4 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a section" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <button type="button" className="press inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-hairline px-4 text-sm font-semibold"><Plus className="size-4" /> Add section</button>
        <button type="button" className="press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--green-action)] px-5 text-sm font-bold text-white"><Save className="size-4" /> Save draft</button>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(22rem,1.1fr)]">
        <div className="grid content-start gap-2">
          {filtered.map((slot) => {
            const index = slots.findIndex((candidate) => candidate.title === slot.title);
            const active = index === selected;
            return (
              <button key={slot.title} type="button" onClick={() => setSelected(index)} className={cn("grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-3 text-left", active ? "border-[var(--green)] bg-[color-mix(in_oklab,var(--green)_7%,transparent)]" : "border-hairline bg-card")}>
                <GripVertical className="size-4 text-muted-foreground" />
                <span className="min-w-0"><span className="block truncate font-semibold">{slot.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{slot.type} · {slot.items} items</span></span>
                <span className={cn("rounded-full px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em]", slot.status === "Live" ? "bg-[color-mix(in_oklab,var(--green)_13%,transparent)] text-[var(--green)]" : "bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold)]")}>{slot.status}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-hairline bg-card p-[clamp(1rem,3vw,2rem)]">
          {current ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--gold)]">Section editor</p><h2 className="mt-1 font-display text-2xl font-black">{current.title}</h2></div>
                <button type="button" onClick={() => toggle(selected)} className="press inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-2 text-xs font-bold">{current.status === "Live" ? <ToggleRight className="size-5 text-[var(--green)]" /> : <ToggleLeft className="size-5 text-muted-foreground" />}{current.status}</button>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold">Display title<input defaultValue={current.title} className="min-h-11 rounded-xl border border-hairline bg-background px-3 font-normal outline-none focus:border-[var(--green)]" /></label>
                <label className="grid gap-2 text-sm font-semibold">Section type<select defaultValue={current.type} className="min-h-11 rounded-xl border border-hairline bg-background px-3 font-normal outline-none"><option>{current.type}</option><option>Curated collection</option><option>YouTube collection</option><option>Podcast collection</option><option>Editorial slot</option></select></label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" className="press flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline text-sm font-semibold text-muted-foreground"><ImagePlus className="size-5" /> Choose artwork</button>
                  <button type="button" className="press flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline text-sm font-semibold text-muted-foreground"><Settings2 className="size-5" /> Select content</button>
                </div>
                <div className="rounded-2xl border border-hairline bg-background p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Eye className="size-4 text-[var(--green)]" /> Front-end preview</div><div className="mt-3 h-28 rounded-xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--green)_12%,#050706),color-mix(in_oklab,var(--gold)_8%,#050706))]" /></div>
              </div>
            </>
          ) : <p className="text-sm text-muted-foreground">Select a section to edit it.</p>}
        </div>
      </div>
    </div>
  );
}
