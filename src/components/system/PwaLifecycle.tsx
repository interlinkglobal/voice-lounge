import { useEffect } from "react";

function setNetworkState(online: boolean) {
  document.documentElement.dataset.network = online ? "online" : "offline";
  window.dispatchEvent(new CustomEvent("voice-lounge:network", { detail: { online } }));
}

export function PwaLifecycle() {
  useEffect(() => {
    setNetworkState(navigator.onLine);

    const onOnline = () => setNetworkState(true);
    const onOffline = () => setNetworkState(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    if (!("serviceWorker" in navigator)) {
      return () => {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      };
    }

    let registration: ServiceWorkerRegistration | null = null;

    const register = async () => {
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
      if (document.visibilityState === "visible") registration?.update().catch(() => undefined);
    };

    if (document.readyState === "complete") void register();
    else window.addEventListener("load", register, { once: true });

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("load", register);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
