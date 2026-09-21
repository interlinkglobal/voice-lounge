import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Share2, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isSafariBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone;
}

export function InstallPwaButton({
  className,
  fullWidth = false,
}: {
  className?: string | undefined;
  fullWidth?: boolean | undefined;
}) {
  const ios = useMemo(() => isIosDevice(), []);
  const safari = useMemo(() => isSafariBrowser(), []);
  const [installed, setInstalled] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [prompting, setPrompting] = useState(false);

  useEffect(() => {
    const sync = () => {
      setInstalled(isStandalone());
      setCanPrompt(Boolean(window.__voiceLoungeInstallPrompt));
    };
    sync();

    const onInstallState = () => sync();
    const onInstalled = () => {
      window.__voiceLoungeInstallPrompt = null;
      setInstalled(true);
      setCanPrompt(false);
      setShowIosInstructions(false);
    };
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => sync();

    window.addEventListener("voice-lounge:pwa-install-state", onInstallState);
    window.addEventListener("appinstalled", onInstalled);
    displayMode.addEventListener?.("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("voice-lounge:pwa-install-state", onInstallState);
      window.removeEventListener("appinstalled", onInstalled);
      displayMode.removeEventListener?.("change", onDisplayModeChange);
    };
  }, []);

  if (installed || (!ios && !canPrompt)) return null;

  const install = async () => {
    if (ios) {
      setShowIosInstructions(true);
      return;
    }

    const prompt = window.__voiceLoungeInstallPrompt;
    if (!prompt || prompting) return;

    setPrompting(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      window.__voiceLoungeInstallPrompt = null;
      setCanPrompt(false);
      if (choice.outcome === "accepted") setInstalled(true);
    } finally {
      setPrompting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void install()}
        className={cn(
          "press inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--green)_45%,transparent)] bg-[color-mix(in_oklab,var(--green)_9%,transparent)] px-3.5 text-sm font-semibold text-[var(--green)] hover:bg-[color-mix(in_oklab,var(--green)_16%,transparent)]",
          fullWidth && "w-full",
          className,
        )}
        aria-label="Install The Voice Lounge app"
      >
        <Download className="size-4" aria-hidden="true" />
        <span>{prompting ? "Opening installer…" : "Install app"}</span>
      </button>

      {showIosInstructions && (
        <div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-labelledby="ios-install-title">
          <button
            type="button"
            aria-label="Close install instructions"
            onClick={() => setShowIosInstructions(false)}
            className="absolute inset-0 h-full w-full bg-black/80 backdrop-blur-md"
          />
          <div className="hyper-glass rise-in absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[141] w-[min(92vw,30rem)] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/15 p-5 shadow-[0_36px_110px_-28px_rgba(0,0,0,.95)] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:p-7">
            <div className="flex items-start gap-4">
              <img
                src="/icon-192x192.png"
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-2xl shadow-lift"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--green)]">Install on iPhone or iPad</p>
                <h2 id="ios-install-title" className="mt-1 font-display text-2xl font-extrabold leading-tight">
                  Add The Voice Lounge to your Home Screen
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowIosInstructions(false)}
                aria-label="Close"
                className="press grid size-9 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {!safari && (
              <div className="mt-5 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] p-4 text-sm">
                Open this page in <strong>Safari</strong> first. iOS exposes the Home Screen install command there.
              </div>
            )}

            <ol className="mt-5 grid gap-3">
              <li className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface-2/65 p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--green-action)] font-bold text-white">1</span>
                <div>
                  <p className="font-semibold">Tap Safari's Share button</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Share2 className="size-4" aria-hidden="true" /> The square with the upward arrow.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface-2/65 p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--green-action)] font-bold text-white">2</span>
                <div>
                  <p className="font-semibold">Choose “Add to Home Screen”</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Plus className="size-4" aria-hidden="true" /> Scroll the Share sheet if necessary.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface-2/65 p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--green-action)] font-bold text-white">3</span>
                <div>
                  <p className="font-semibold">Tap “Add”</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Smartphone className="size-4" aria-hidden="true" /> The app opens independently from Safari after installation.</p>
                </div>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIosInstructions(false)}
              className="press mt-5 w-full rounded-full bg-[var(--green-action)] px-5 py-3 font-semibold text-white shadow-glow"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
