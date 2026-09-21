import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteLanguage = "en" | "xh" | "zu" | "af";

export const SITE_LANGUAGES: Array<{ value: SiteLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "xh", label: "isiXhosa" },
  { value: "zu", label: "isiZulu" },
  { value: "af", label: "Afrikaans" },
];

const STORAGE_KEY = "tvl-language";
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
        ) => unknown | undefined;
      };
    };
    tvlGoogleTranslateInit?: () => void | undefined;
  }
}

function readLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return SITE_LANGUAGES.some((item) => item.value === stored)
    ? (stored as SiteLanguage)
    : "en";
}

function setGoogleTranslateCookie(language: SiteLanguage) {
  const value = language === "en" ? "" : `/en/${language}`;
  const maxAge = language === "en" ? 0 : 60 * 60 * 24 * 365;
  document.cookie = `googtrans=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en");

  useEffect(() => {
    setLanguageState(readLanguage());

    const mountWidget = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement || document.getElementById(WIDGET_ID)?.childElementCount) return;
      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "af,xh,zu",
          autoDisplay: false,
          multilanguagePage: false,
        },
        WIDGET_ID,
      );
    };

    window.tvlGoogleTranslateInit = mountWidget;
    mountWidget();

    if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=tvlGoogleTranslateInit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.tvlGoogleTranslateInit;
    };
  }, []);

  const setLanguage = useCallback((next: SiteLanguage) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setGoogleTranslateCookie(next);
    document.documentElement.lang = next === "en" ? "en-ZA" : next;
    setLanguageState(next);

    if (next === "en") {
      window.location.reload();
      return;
    }

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = next;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    // The translation script may still be loading on the first interaction.
    // Cookie persistence guarantees the requested language on the reload.
    window.location.reload();
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <TranslationContext.Provider value={value}>
      <div id={WIDGET_ID} className="hidden" aria-hidden="true" />
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationLanguage() {
  return useContext(TranslationContext);
}
