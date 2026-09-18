import { useEffect } from "react";

export interface VoiceLoungeInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface Window {
    __voiceLoungeInstallPrompt?: VoiceLoungeInstallPrompt | null;
  }
}

function isStandalone() {
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone;
}

function setNetworkState(online: boolean) {
  document.documentElement.dataset.network = online ? "online" : "offline";
  window.dispatchEvent(new CustomEvent("voice-lounge:network", { detail: { online } }));
}

function setInstallState(installed: boolean) {
  document.documentElement.dataset.pwaInstalled = installed ? "true" : "false";
  window.dispatchEvent(
    new CustomEvent("voice-lounge:pwa-install-state", {
      detail: {
        installed,
        available: Boolean(window.__voiceLoungeInstallPrompt),
      },
    }),
  );
}

export function PwaLifecycle() {
  useEffect(() => {
    setNetworkState(navigator.onLine);
    setInstallState(isStandalone());

    const onOnline = () => setNetworkState(true);
    const onOffline = () => setNetworkState(false);
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__voiceLoungeInstallPrompt = event as VoiceLoungeInstallPrompt;
      setInstallState(false);
    };
    const onAppInstalled = () => {
      window.__voiceLoungeInstallPrompt = null;
      setInstallState(true);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    let registration: ServiceWorkerRegistration | null = null;

    const register = async () => {
      if (!("serviceWorker" in navigator)) return;
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        await registration.update();

        registration.addEventListener("updatefound", () => {
          const worker = registration?.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent("voice-lounge:pwa-update"));
            }
          });
        });
      } catch (error) {
        console.error("[pwa] service worker registration failed", error);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        registration?.update().catch(() => undefined);
        setInstallState(isStandalone());
      }
    };

    if (document.readyState === "complete") void register();
    else window.addEventListener("load", register, { once: true });

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("load", register);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
