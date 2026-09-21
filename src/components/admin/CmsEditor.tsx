import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  BarChart3,
  Eye,
  FileText,
  ImagePlus,
  LayoutGrid,
  Newspaper,
  Pencil,
  Plus,
  Podcast,
  Search,
  Settings2,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSelect } from "@/components/ui/AppSelect";
import { SmartImage } from "@/components/media/SmartImage";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categories, creators, news, podcasts } from "@/lib/content/catalog";
import { VERIFIED_GUESTS } from "@/lib/content/guests";
import { SHOW_SCHEDULE } from "@/lib/content/programme-directory";

type AreaKey = "home" | "discover" | "podcasts" | "shows" | "watch" | "news";
type FieldType = "text" | "textarea" | "number" | "select";

interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface CmsRecord {
  id: string;
  title: string;
  type: string;
  status: "Live" | "Draft";
  detail: string;
  count: number;
  [key: string]: string | number;
}

interface AreaDefinition {
  title: string;
  description: string;
  singular: string;
  records: CmsRecord[];
  fields: FieldDef[];
}

const categoryNames = categories.map((category) => category.name);

const DEFINITIONS: Record<AreaKey, AreaDefinition> = {
  home: {
    title: "Homepage",
    description: "Manage the visible homepage sections, labels and editorial ordering.",
    singular: "homepage section",
    records: [
      { id: "home-trending", title: "Trending Now", type: "YouTube rail", status: "Live", detail: "Latest channel uploads", count: 10 },
      { id: "home-editors", title: "Editor's Picks", type: "Curated collection", status: "Live", detail: "Editorially selected content", count: 8 },
      { id: "home-featured-podcast", title: "Featured Podcast", type: "Feature", status: "Live", detail: "Primary podcast feature", count: 1 },
      { id: "home-categories", title: "Browse Categories", type: "Category grid", status: "Live", detail: "Programme discovery categories", count: categories.length },
      { id: "home-most-watched", title: "Most Watched", type: "Video collection", status: "Live", detail: "Popular channel uploads", count: 10 },
      { id: "home-creators", title: "Creator Spotlight", type: "Creator collection", status: "Live", detail: "Voice Lounge presenters", count: 6 },
    ],
    fields: [
      { key: "title", label: "Display title", required: true },
      { key: "type", label: "Section type", type: "select", options: ["YouTube rail", "Curated collection", "Feature", "Category grid", "Video collection", "Creator collection"] },
      { key: "detail", label: "Purpose", type: "textarea" },
      { key: "count", label: "Items", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
  discover: {
    title: "Discover",
    description: "Manage discovery controls and the content collections viewers can filter.",
    singular: "discover configuration",
    records: [
      { id: "discover-topic", title: "Topic", type: "Filter", status: "Live", detail: "Topic and editorial subject", count: categories.length },
      { id: "discover-programme", title: "Programme", type: "Filter", status: "Live", detail: "Programme directory", count: podcasts.length },
      { id: "discover-person", title: "Person", type: "Filter", status: "Live", detail: "Creators and guests", count: creators.length + VERIFIED_GUESTS.length },
      { id: "discover-language", title: "Language", type: "Filter", status: "Live", detail: "English, isiXhosa, isiZulu and Afrikaans", count: 4 },
      { id: "discover-format", title: "Format", type: "Filter", status: "Live", detail: "Video, podcast and mixed formats", count: 3 },
    ],
    fields: [
      { key: "title", label: "Filter label", required: true },
      { key: "type", label: "Control type", type: "select", options: ["Filter", "Collection", "Search source"] },
      { key: "detail", label: "Description", type: "textarea" },
      { key: "count", label: "Options", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
  podcasts: {
    title: "Podcasts",
    description: "Manage the podcast directory metadata and presentation records.",
    singular: "podcast",
    records: podcasts.map((podcast) => ({
      id: podcast.id,
      title: podcast.title,
      type: categories.find((category) => category.id === podcast.categoryId)?.name ?? "Voice Lounge",
      status: "Live",
      detail: podcast.tagline,
      count: podcast.episodeCount,
    })),
    fields: [
      { key: "title", label: "Podcast title", required: true },
      { key: "type", label: "Category", type: "select", options: categoryNames },
      { key: "detail", label: "Description", type: "textarea" },
      { key: "count", label: "Episode count", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
  shows: {
    title: "Shows",
    description: "Manage schedule slots, hosts and programme timing.",
    singular: "show slot",
    records: SHOW_SCHEDULE.map((entry, index) => {
      const podcast = podcasts.find((item) => item.id === entry.podcastId);
      return {
        id: `show-${index + 1}`,
        title: podcast?.title ?? entry.podcastId,
        type: entry.day,
        status: "Live",
        detail: entry.host,
        count: index + 1,
        time: entry.time,
      };
    }),
    fields: [
      { key: "title", label: "Show", required: true },
      { key: "type", label: "Schedule day", type: "select", options: ["Monday–Friday", "Saturday", "Sunday"] },
      { key: "time", label: "Time" },
      { key: "detail", label: "Host / presenter" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
  watch: {
    title: "Watch",
    description: "Control how the YouTube catalogue is surfaced in Watch and video collections.",
    singular: "video collection",
    records: [
      { id: "watch-latest", title: "Latest videos", type: "YouTube collection", status: "Live", detail: "Latest-first official channel uploads", count: 12 },
      { id: "watch-most", title: "Most watched", type: "YouTube collection", status: "Live", detail: "High-view channel content", count: 10 },
      { id: "watch-live", title: "Previous lives", type: "Live archive", status: "Live", detail: "Completed channel live broadcasts", count: 8 },
      { id: "watch-player", title: "Player recommendations", type: "Recommendation rule", status: "Live", detail: "Next video selection and recent-history exclusion", count: 6 },
    ],
    fields: [
      { key: "title", label: "Collection title", required: true },
      { key: "type", label: "Collection type", type: "select", options: ["YouTube collection", "Live archive", "Recommendation rule"] },
      { key: "detail", label: "Rule / description", type: "textarea" },
      { key: "count", label: "Items", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
  news: {
    title: "News",
    description: "Manage Voice Lounge newsroom cards and editorial status.",
    singular: "article",
    records: news.map((article) => ({
      id: article.id,
      title: article.headline,
      type: article.section,
      status: "Live",
      detail: article.standfirst,
      count: article.readingMinutes,
      author: article.author,
    })),
    fields: [
      { key: "title", label: "Headline", required: true },
      { key: "type", label: "Section" },
      { key: "author", label: "Author" },
      { key: "detail", label: "Standfirst", type: "textarea" },
      { key: "count", label: "Reading minutes", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft"] },
    ],
  },
};

function storageKey(area: AreaKey) {
  return `voice-lounge-cms:${area}:records:v2`;
}

function readRows(area: AreaKey) {
  const initial = DEFINITIONS[area].records;
  if (typeof window === "undefined") return initial;
  try {
    const stored = window.localStorage.getItem(storageKey(area));
    return stored ? (JSON.parse(stored) as CmsRecord[]) : initial;
  } catch {
    return initial;
  }
}

function newRecord(area: AreaKey): CmsRecord {
  const definition = DEFINITIONS[area];
  return {
    id: `draft-${Date.now()}`,
    title: "",
    type: definition.fields.find((field) => field.key === "type")?.options?.[0] ?? "Content",
    status: "Draft",
    detail: "",
    count: 0,
  };
}

function StatusBadge({ status }: { status: CmsRecord["status"] }) {
  return (
    <Badge
      variant="outline"
      className={status === "Live"
        ? "border-[color-mix(in_oklab,var(--green)_45%,var(--hairline))] text-[var(--green)]"
        : "border-[color-mix(in_oklab,var(--gold)_45%,var(--hairline))] text-[var(--gold)]"}
    >
      {status}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className="rounded-md bg-[color-mix(in_oklab,var(--green)_10%,transparent)] p-2 text-[var(--green)]">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CmsOverview() {
  const recentNews = [...news]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Podcasts" value={podcasts.length} icon={Podcast} hint="programme directory" />
        <StatCard label="Show slots" value={SHOW_SCHEDULE.length} icon={LayoutGrid} hint="weekly schedule" />
        <StatCard label="News" value={news.length} icon={Newspaper} hint="published records" />
        <StatCard label="Creators" value={creators.length} icon={Users} hint="presenter profiles" />
        <StatCard label="Guests" value={VERIFIED_GUESTS.length} icon={Users} hint="verified directory" />
        <StatCard label="Categories" value={categories.length} icon={FileText} hint="content taxonomy" />
        <StatCard label="Languages" value={4} icon={Settings2} hint="site language choices" />
        <StatCard label="Workspace" value="Ready" icon={BarChart3} hint="front-end controls" />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Recent editorial activity</CardTitle>
          <CardDescription>Latest dated newsroom records available to the Voice Lounge site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-[34rem] truncate text-sm font-medium">{article.headline}</TableCell>
                    <TableCell className="text-sm">{article.section}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-ZA") : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {!recentNews.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">No recent activity</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CmsContentControl({ area }: { area: AreaKey }) {
  const definition = DEFINITIONS[area];
  const [rows, setRows] = useState<CmsRecord[]>(() => readRows(area));
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(area), JSON.stringify(rows));
    } catch {
      // Local draft persistence is best-effort.
    }
  }, [area, rows]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      [row.title, row.type, row.detail, String(row.status)]
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [query, rows]);

  function save(record: CmsRecord) {
    if (!record.title.trim()) {
      toast.error("A title is required.");
      return;
    }

    setRows((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists
        ? current.map((item) => item.id === record.id ? record : item)
        : [record, ...current];
    });
    toast.success(creating ? `${definition.singular} created` : "Changes saved");
    setEditing(null);
    setCreating(false);
  }

  function remove(id: string) {
    setRows((current) => current.filter((item) => item.id !== id));
    setConfirmId(null);
    toast.success("Record removed from the draft workspace");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{definition.title}</h1>
          <p className="text-sm text-muted-foreground">{definition.description}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-8 sm:w-64"
            />
          </div>
          <Button
            onClick={() => {
              setEditing(newRecord(area));
              setCreating(true);
            }}
            className="bg-[var(--green-action)] text-white hover:brightness-110"
          >
            <Plus className="mr-2 size-4" aria-hidden="true" />
            New
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-hairline bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No records</TableCell>
                </TableRow>
              )}
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[20rem] truncate text-sm font-medium">{row.title}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{row.type}</TableCell>
                  <TableCell className="max-w-[24rem] truncate text-sm text-muted-foreground">{row.detail}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${row.title}`}
                        onClick={() => {
                          setEditing({ ...row });
                          setCreating(false);
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${row.title}`}
                        onClick={() => setConfirmId(row.id)}
                      >
                        <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} of {rows.length} record(s) — changes are retained in this browser as Voice Lounge CMS drafts.
      </div>

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{creating ? `New ${definition.singular}` : `Edit ${definition.singular}`}</DialogTitle>
            <DialogDescription>
              Update the Voice Lounge presentation record. This mirrors the ACGC create/edit workflow while remaining a local draft until CMS persistence is wired.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              {definition.fields.map((field) => {
                const value = editing[field.key] ?? "";
                const set = (next: string | number) =>
                  setEditing({ ...editing, [field.key]: next });

                return (
                  <div
                    key={field.key}
                    className={field.type === "textarea" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}
                  >
                    <Label htmlFor={`cms-${area}-${field.key}`}>
                      {field.label}{field.required ? <span className="text-destructive"> *</span> : null}
                    </Label>

                    {field.type === "textarea" ? (
                      <Textarea
                        id={`cms-${area}-${field.key}`}
                        value={String(value)}
                        onChange={(event) => set(event.target.value)}
                        rows={4}
                        placeholder={field.placeholder}
                        className="resize-none"
                      />
                    ) : field.type === "select" ? (
                      <AppSelect
                        value={String(value)}
                        onValueChange={(next) => set(next)}
                        options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
                        ariaLabel={field.label}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        id={`cms-${area}-${field.key}`}
                        type={field.type === "number" ? "number" : "text"}
                        value={String(value)}
                        onChange={(event) => set(field.type === "number" ? Number(event.target.value) : event.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[var(--green-action)] text-white hover:brightness-110"
              onClick={() => editing && save(editing)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(confirmId)} onOpenChange={(open) => !open && setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this record?</DialogTitle>
            <DialogDescription>
              It will be removed from this browser's Voice Lounge CMS draft. Public-site source data is not deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmId && remove(confirmId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const MEDIA_SURFACES = [
  { id: "media-home-card", title: "Membership card assets", route: "/", ratio: "Card / 1:1", fallback: "1:1", note: "Logo, badge and membership-card imagery." },
  { id: "media-podcasts", title: "Podcast artwork", route: "/podcasts", ratio: "1:1", fallback: "1:1", note: "Podcast and programme directory artwork." },
  { id: "media-shows", title: "Show artwork", route: "/shows", ratio: "9:16", fallback: "9:16", note: "Tall schedule and show cards." },
  { id: "media-guests", title: "Guest portraits", route: "/guests", ratio: "1:1", fallback: "1:1", note: "Guest profile and directory portraits." },
  { id: "media-creators", title: "Creator portraits", route: "/creators", ratio: "1:1", fallback: "1:1", note: "Presenter and creator profiles." },
  { id: "media-news", title: "News artwork", route: "/news", ratio: "16:9", fallback: "16:9", note: "Article cards and editorial imagery." },
  { id: "media-youtube", title: "Video thumbnails", route: "/youtube · /watch", ratio: "16:9", fallback: "16:9", note: "YouTube thumbnails and video cards." },
  { id: "media-live", title: "Live media", route: "/live", ratio: "16:9", fallback: "16:9", note: "Live player and previous broadcasts." },
  { id: "media-community", title: "Community avatars", route: "/community", ratio: "1:1", fallback: "1:1", note: "Commenter and account avatars." },
  { id: "media-about", title: "About imagery", route: "/about", ratio: "16:9", fallback: "16:9", note: "Research/editorial imagery." },
] as const;

export function CmsUploadsControl() {
  const [selected, setSelected] = useState<(typeof MEDIA_SURFACES)[number]>(MEDIA_SURFACES[0]);
  const [preview, setPreview] = useState<string | null>(null);

  function chooseFile(file: File | null) {
    if (!file) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    toast.success("Replacement staged for preview");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Uploads & media</h1>
        <p className="text-sm text-muted-foreground">
          Review every upload-dependent surface and stage replacement artwork before backend media persistence is connected.
        </p>
      </div>

      <div className="rounded-md border border-hairline bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Surface</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Ratio</TableHead>
                <TableHead>Fallback</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MEDIA_SURFACES.map((surface) => (
                <TableRow key={surface.id}>
                  <TableCell>
                    <div className="font-medium">{surface.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{surface.note}</div>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--green)]">{surface.route}</TableCell>
                  <TableCell className="text-sm">{surface.ratio}</TableCell>
                  <TableCell><Badge variant="outline">{surface.fallback}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(surface)}>
                      <Eye className="mr-1 size-4" aria-hidden="true" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{selected.title}</CardTitle>
          <CardDescription>{selected.note}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="overflow-hidden rounded-md border border-hairline bg-black">
              {preview ? (
                <img src={preview} alt="Staged replacement preview" className="aspect-video h-full w-full object-cover" />
              ) : (
                <SmartImage
                  fallbackRatio={selected.fallback as "1:1" | "9:16" | "16:9"}
                  alt="Current Voice Lounge fallback preview"
                  className="aspect-video h-full w-full object-cover"
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="rounded-md border border-hairline p-3 text-sm">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Required ratio</div>
                <div className="mt-1 font-semibold">{selected.ratio}</div>
              </div>

              <label className="press flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-surface-2">
                <Upload className="size-4" aria-hidden="true" />
                Choose replacement
                <input type="file" accept="image/*" className="hidden" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} />
              </label>

              {preview && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                    setPreview(null);
                  }}
                >
                  <X className="mr-2 size-4" aria-hidden="true" /> Clear preview
                </Button>
              )}

              <Button disabled className="w-full bg-[var(--green-action)] text-white">
                <ImagePlus className="mr-2 size-4" aria-hidden="true" /> Upload pending backend
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
