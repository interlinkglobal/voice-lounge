import { useAuth } from "@/components/auth/AuthProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteLanguage =
  | "en"
  | "af"
  | "nr"
  | "xh"
  | "zu"
  | "ss"
  | "nso"
  | "tn"
  | "st"
  | "ts"
  | "ve"
  | "sasl";

export const SITE_LANGUAGES: Array<{
  value: SiteLanguage;
  label: string;
  disabled?: boolean;
}> = [
  { value: "en", label: "English" },
  { value: "af", label: "Afrikaans" },
  { value: "nr", label: "isiNdebele" },
  { value: "xh", label: "isiXhosa" },
  { value: "zu", label: "isiZulu" },
  { value: "ss", label: "siSwati" },
  { value: "nso", label: "Sepedi" },
  { value: "tn", label: "Setswana" },
  { value: "st", label: "Sesotho" },
  { value: "ts", label: "itsonga" },
  { value: "ve", label: "Tshivenda" },
  { value: "sasl", label: "South African Sign Language · text translation unavailable", disabled: true },
];

const TRANSLATABLE = new Set<SiteLanguage>(["en","af","nr","xh","zu","ss","nso","tn","st","ts","ve"]);
const GOOGLE_LANGUAGES = "af,nr,xh,zu,ss,nso,tn,st,ts,ve";
const STORAGE_KEY = "tvl-language";
const ACCOUNT_SYNC_KEY = "tvl-language-account-synced";
const GOOGLE_SCRIPT_ID = "tvl-google-translate";
const WIDGET_ID = "tvl-google-translate-element";

type TranslationContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const TranslationContext = createContext<TranslationContextValue>({
  language: "en",
  setLanguage: () => undefined,
});

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
    tvlGoogleTranslateInit?: () => void;
  }
}

function readLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as SiteLanguage | null;
  if (!stored || !TRANSLATABLE.has(stored)) return "en";
  return stored;
}

function setGoogleTranslateCookie(language: SiteLanguage) {
  const value = language === "en" ? "" : `/en/${language}`;
  const maxAge = language === "en" ? 0 : 60 * 60 * 24 * 365;
  document.cookie = `googtrans=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function suppressInjectedGoogleUi() {
  document.documentElement.style.removeProperty("margin-top");
  document.body.style.removeProperty("top");
  document.body.style.removeProperty("position");

  [
    ".goog-te-banner-frame",
    ".goog-te-balloon-frame",
    ".VIpgJd-ZVi9od-ORHb-OEVmcd",
    ".VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
    "iframe.goog-te-banner-frame",
  ].forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.setAttribute("aria-hidden", "true");
    });
  });
}

function applyGoogleLanguage(language: SiteLanguage) {
  if (language === "en") return true;
  if (!TRANSLATABLE.has(language)) return false;
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;
  combo.value = language;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  suppressInjectedGoogleUi();
  return true;
}

function ensureGoogleRuntime(language: SiteLanguage) {
  if (language === "en" || !TRANSLATABLE.has(language) || typeof document === "undefined") return;

  let attempts = 0;
  const applyWhenReady = () => {
    suppressInjectedGoogleUi();
    if (applyGoogleLanguage(language)) return;
    attempts += 1;
    if (attempts < 30) window.setTimeout(applyWhenReady, 200);
  };

  const mountWidget = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    const host = document.getElementById(WIDGET_ID);
    if (!TranslateElement || !host) return;
    if (!host.childElementCount) {
      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: GOOGLE_LANGUAGES,
          autoDisplay: false,
          multilanguagePage: false,
        },
        WIDGET_ID,
      );
    }
    applyWhenReady();
  };

  window.tvlGoogleTranslateInit = mountWidget;

  if (window.google?.translate?.TranslateElement) {
    mountWidget();
    return;
  }

  if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=tvlGoogleTranslateInit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const user = useAuth();
  const [language, setLanguageState] = useState<SiteLanguage>("en");

  useEffect(() => {
    const stored = readLanguage();
    setLanguageState(stored);
    document.documentElement.lang = stored === "en" ? "en-ZA" : stored;
    if (stored !== "en") window.setTimeout(() => ensureGoogleRuntime(stored), 0);

    return () => {
      delete window.tvlGoogleTranslateInit;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const syncMarker = `${ACCOUNT_SYNC_KEY}:${user.id}`;
    if (window.sessionStorage.getItem(syncMarker) === "1") return;
    window.sessionStorage.setItem(syncMarker, "1");

    let active = true;
    const syncAccountLanguage = async () => {
      try {
        const response = await fetch("/api/account", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => ({}))) as {
          profile?: { preferred_language?: SiteLanguage } | null;
        };
        const preferred = payload.profile?.preferred_language;
        if (!active || !preferred || !TRANSLATABLE.has(preferred)) return;

        const current = readLanguage();
        if (preferred === current) return;

        window.localStorage.setItem(STORAGE_KEY, preferred);
        setGoogleTranslateCookie(preferred);
        document.documentElement.lang = preferred === "en" ? "en-ZA" : preferred;
        setLanguageState(preferred);

        if (preferred === "en") window.location.reload();
        else ensureGoogleRuntime(preferred);
      } catch {
        // Local language preference remains valid when account synchronisation is unavailable.
      }
    };

    const timer = window.setTimeout(() => void syncAccountLanguage(), 700);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [user?.id]);

  const setLanguage = useCallback((next: SiteLanguage) => {
    if (!TRANSLATABLE.has(next)) return;

    window.localStorage.setItem(STORAGE_KEY, next);
    setGoogleTranslateCookie(next);
    document.documentElement.lang = next === "en" ? "en-ZA" : next;
    setLanguageState(next);

    if (next === "en") {
      window.location.reload();
      return;
    }
    ensureGoogleRuntime(next);
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <TranslationContext.Provider value={value}>
      <div
        id={WIDGET_ID}
        className="notranslate pointer-events-none fixed -left-[10000px] -top-[10000px] size-px overflow-hidden opacity-0"
        aria-hidden="true"
        translate="no"
      />
      <style>{`
        html { margin-top: 0 !important; }
        body { top: 0 !important; }
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationLanguage() {
  return useContext(TranslationContext);
}
