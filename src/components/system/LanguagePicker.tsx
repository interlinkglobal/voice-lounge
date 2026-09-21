import { useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SITE_LANGUAGES, type SiteLanguage } from "@/components/system/TranslationProvider";
import { cn } from "@/lib/utils";

export function LanguagePicker({
  value,
  onValueChange,
  ariaLabel,
  className,
}: {
  value: SiteLanguage;
  onValueChange: (value: SiteLanguage) => void;
  ariaLabel: string;
  className?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const current = SITE_LANGUAGES.find((option) => option.value === value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "press flex min-h-11 w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-xl border border-hairline bg-background px-3 text-sm font-semibold shadow-none sm:w-auto",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Languages className="size-4 shrink-0 text-[var(--green)]" aria-hidden="true" />
            <span className="truncate">{current?.label ?? "Language"}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="notranslate left-1/2 top-[43%] max-h-[78vh] w-[min(92vw,38rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.5rem] border-hairline bg-popover p-5 shadow-[0_30px_90px_-30px_rgba(0,0,0,.72)] sm:top-[46%] sm:p-6"
        translate="no"
      >
        <div className="pr-8">
          <DialogTitle className="font-display text-2xl font-black tracking-[-0.03em]">
            Choose language
          </DialogTitle>
          <DialogDescription className="mt-2 leading-6">
            Your selection stays active on this browser until you change it here.
          </DialogDescription>
        </div>

        <div
          role="listbox"
          aria-label={ariaLabel}
          className="mt-2 grid max-h-[58vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          {SITE_LANGUAGES.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled ?? false}
                onClick={() => {
                  if (option.disabled) return;
                  onValueChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "press flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm font-semibold",
                  selected
                    ? "border-[color-mix(in_oklab,var(--green)_58%,transparent)] bg-[color-mix(in_oklab,var(--green)_10%,transparent)] text-foreground"
                    : "border-hairline bg-background/55 text-foreground hover:bg-surface-2",
                  option.disabled && "cursor-not-allowed opacity-45",
                )}
              >
                <span>{option.label}</span>
                {selected && <Check className="size-4 shrink-0 text-[var(--green)]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
