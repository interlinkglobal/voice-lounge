import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, ExternalLink, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";
import {
  INTERLINK_PAYMENT_URL,
  VOICE_LOUNGE_PREMIUM_AMOUNT_ZAR,
  VOICE_LOUNGE_PREMIUM_DISPLAY_ZAR,
  VOICE_LOUNGE_PREMIUM_ITEM,
  VOICE_LOUNGE_PREMIUM_PRODUCT,
} from "@/lib/premium/payment";

export const Route = createFileRoute("/premium")({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_reference:
      typeof search["payment_reference"] === "string"
        ? search["payment_reference"]
        : undefined,
  }),
  head: () => routeHead("premium"),
  component: Page,
});

type GateState = "loading" | "locked" | "active";

function Page() {
  const user = useAuth();
  const { payment_reference: paymentReference } = Route.useSearch();
  const [gate, setGate] = useState<GateState>("loading");
  const [confirming, setConfirming] = useState(Boolean(paymentReference));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (paymentReference) {
        if (!user) {
          if (active) {
            setConfirming(false);
            setGate("locked");
            setError("Sign in to the same Voice Lounge account before activating this payment.");
          }
          return;
        }

        try {
          const response = await fetch("/api/premium/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: paymentReference }),
          });
          const payload = (await response.json().catch(() => ({}))) as {
            error?: string | undefined;
          };
          if (!response.ok) {
            throw new Error(payload.error || "Premium activation could not be confirmed.");
          }
          if (active) {
            window.history.replaceState({}, "", "/premium");
            setError("");
            setConfirming(false);
            setGate("active");
          }
          return;
        } catch (caught: unknown) {
          if (active) {
            setError(
              caught instanceof Error
                ? caught.message
                : "Premium activation could not be confirmed.",
            );
            setConfirming(false);
            setGate("locked");
          }
          return;
        }
      }

      try {
        const response = await fetch("/api/premium/status", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => ({}))) as {
          active?: boolean | undefined;
          error?: string | undefined;
        };
        if (!response.ok) {
          throw new Error(payload.error || "Premium status could not be checked.");
        }
        if (active) {
          setGate(payload.active ? "active" : "locked");
        }
      } catch (caught: unknown) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Premium status could not be checked.",
          );
          setGate("locked");
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [paymentReference, user?.id]);

  const startCheckout = () => {
    if (!user) return;

    const params = new URLSearchParams({
      v: "1",
      open: "1",
      product: VOICE_LOUNGE_PREMIUM_PRODUCT,
      name: user.name || "Voice Lounge member",
      item: VOICE_LOUNGE_PREMIUM_ITEM,
      reference: user.id,
      amount: VOICE_LOUNGE_PREMIUM_AMOUNT_ZAR,
      email: user.email,
    });

    window.location.assign(`${INTERLINK_PAYMENT_URL}?${params.toString()}`);
  };

  const developmentUnlock = async () => {
    try {
      const response = await fetch("/api/premium/dev-unlock", { method: "POST" });
      if (response.ok) {
        setError("");
        setGate("active");
      }
    } catch {
      // Development bypass intentionally fails silently outside development/preview.
    }
  };

  if (gate === "active") {
    return <PlatformPage page="premium" />;
  }

  return (
    <div className="grain hero-wash relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-15%] size-[34rem] rounded-full bg-[color-mix(in_oklab,var(--green)_16%,transparent)] blur-[110px]" />
        <div className="absolute bottom-[-18%] right-[-8%] size-[32rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_13%,transparent)] blur-[115px]" />
      </div>

      <div className="min-h-[calc(100vh-5rem)] grid place-items-center overflow-y-auto px-4 py-8 sm:py-12">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-paywall-title"
          onDoubleClick={() => void developmentUnlock()}
          className="hyper-glass w-full max-w-xl rounded-[2rem] border border-[color-mix(in_oklab,var(--gold)_42%,var(--hairline))] p-5 text-foreground shadow-gold sm:p-8"
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--gold)]">
                <Crown className="size-3.5" aria-hidden="true" />
                Premium access
              </div>
              <h1
                id="premium-paywall-title"
                className="mt-5 font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl"
              >
                Voice Lounge Premium
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Premium content is behind a paid membership gate. Checkout is
                processed by Interlink Global Technologies through Paystack.
              </p>
            </div>
            <LockKeyhole className="mt-1 size-6 shrink-0 text-[var(--gold)]" aria-hidden="true" />
          </div>

          <div className="mt-7 rounded-3xl border border-hairline p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Premium monthly
                </p>
                <p className="mt-1 font-display text-4xl font-black text-gold-foil">
                  R{VOICE_LOUNGE_PREMIUM_DISPLAY_ZAR}
                </p>
              </div>
              <ShieldCheck className="size-7 text-[var(--green)]" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Premium is advertised at R{VOICE_LOUNGE_PREMIUM_DISPLAY_ZAR} monthly.
              Checkout is submitted to Paystack as R{VOICE_LOUNGE_PREMIUM_AMOUNT_ZAR},
              then the payment reference is re-verified server-side against the
              signed-in Voice Lounge account before access is granted.
            </p>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
              {error}
            </div>
          ) : null}

          <div className="mt-6">
            {gate === "loading" || confirming ? (
              <button
                type="button"
                disabled
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-6 font-bold text-black opacity-70"
              >
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {confirming ? "Confirming payment" : "Checking Premium access"}
              </button>
            ) : user ? (
              <button
                type="button"
                onClick={startCheckout}
                className="press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-6 font-bold text-black shadow-gold"
              >
                Pay securely through Interlink
                <ExternalLink className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <Link
                to="/login"
                search={{ auth: undefined, returnTo: "/premium" }}
                className="press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--green-action)] px-6 font-bold text-white shadow-glow"
              >
                Sign in to continue
              </Link>
            )}
          </div>

          <p className="mt-4 text-center text-[0.68rem] leading-5 text-muted-foreground">
            Paid access is granted only after Interlink confirms the transaction.
          </p>
        </section>
      </div>
    </div>
  );
}
