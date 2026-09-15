import { useEffect, useState } from "react";

const KEY = "vl-consent";

/** POPIA-aware consent bar. No tracking scripts run before a choice is made. */
export function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: "all" | "essential") => {
    localStorage.setItem(KEY, value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-24 left-1/2 z-[var(--z-overlay)] w-[min(40rem,92vw)] -translate-x-1/2 rounded-2xl border border-hairline bg-popover p-4 shadow-lift md:bottom-24"
    >
      <p className="text-sm">
        We use essential cookies to run The Voice Lounge, and optional ones to measure what people listen to. You can
        change this at any time under Account → Privacy.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => decide("all")}
          className="press rounded-full bg-[var(--green-action)] px-4 py-2 text-sm font-semibold text-white"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => decide("essential")}
          className="press rounded-full border border-hairline px-4 py-2 text-sm font-semibold"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
