import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

export type ThemeChoice = "light" | "dark" | "system";

const KEY = "vl-theme";

interface ThemeCtx {
  choice: ThemeChoice;
  resolved: "light" | "dark";
  setChoice: (c: ThemeChoice) => void;
}

const Ctx = createContext<ThemeCtx>({ choice: "system", resolved: "dark", setChoice: () => {} });

/** Runs before hydration to prevent a theme flash. */
export const themeBootstrapScript = `(function(){try{var c=localStorage.getItem("${KEY}")||"system";var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=c==="dark"||(c==="system"&&m);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  const apply = useCallback((c: ThemeChoice) => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = c === "dark" || (c === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as ThemeChoice | null) ?? "system";
    setChoiceState(stored);
    apply(stored);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(KEY) as ThemeChoice | null) === "system" || !localStorage.getItem(KEY)) apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setChoice = useCallback(
    (c: ThemeChoice) => {
      setChoiceState(c);
      localStorage.setItem(KEY, c);
      apply(c);
      track("theme_change", { theme: c });
    },
    [apply],
  );

  return <Ctx.Provider value={{ choice, resolved, setChoice }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
