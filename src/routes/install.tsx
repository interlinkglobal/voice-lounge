import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ShieldCheck, Smartphone, WifiOff, Zap } from "lucide-react";
import { InstallPwaButton } from "@/components/system/InstallPwaButton";

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [
      { title: "Install The Voice Lounge" },
      {
        name: "description",
        content: "Install The Voice Lounge as an app on Android, iPhone, iPad, Windows and other supported devices.",
      },
      { property: "og:title", content: "Install The Voice Lounge" },
      {
        property: "og:description",
        content: "Add The Voice Lounge to your device for a faster, app-like listening and watching experience.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: InstallPage,
});

const BENEFITS = [
  {
    icon: Zap,
    title: "Launch like an app",
    body: "Open The Voice Lounge directly from your Home Screen or app launcher without navigating through browser tabs.",
  },
  {
    icon: WifiOff,
    title: "Offline-ready shell",
    body: "The installed experience keeps the application shell available when connectivity drops and refreshes content when you reconnect.",
  },
  {
    icon: Smartphone,
    title: "Built for every screen",
    body: "The same responsive Voice Lounge experience adapts from phones and tablets to desktop displays.",
  },
  {
    icon: ShieldCheck,
    title: "No app store required",
    body: "Install directly from the website using your browser's native Progressive Web App capabilities.",
  },
] as const;

function InstallPage() {
  return (
    <div className="pb-[var(--section-gap)]">
      <section className="hero-wash grain relative isolate overflow-hidden border-b border-hairline">
        <div className="shell grid min-h-[72vh] items-center gap-10 py-[clamp(3rem,8vw,8rem)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,34rem)]">
          <div className="vl-component-enter max-w-3xl">
            <Link
              to="/"
              className="press mb-7 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2/70 px-4 py-2 text-sm font-semibold backdrop-blur hover:border-[var(--green)] hover:text-[var(--green)]"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to The Voice Lounge
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">
              <Download className="size-4" aria-hidden="true" />
              Progressive Web App
            </div>

            <h1 className="mt-5 font-display text-[var(--step-6)] font-black leading-[0.9] tracking-[-0.055em]">
              Put The Voice Lounge on your device.
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1rem,1.5vw,1.3rem)] leading-relaxed text-muted-foreground">
              Install the full Voice Lounge experience directly from the web. Android and supported desktop browsers use the native installer; iPhone and iPad users get the exact Safari Home Screen steps.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <InstallPwaButton className="min-h-12 px-6 text-base" />
              <span className="text-sm text-muted-foreground">No store download required.</span>
            </div>
          </div>

          <div className="vl-component-enter mx-auto w-full max-w-md">
            <div className="hyper-glass relative overflow-hidden rounded-[2.5rem] border border-white/15 p-6 shadow-lift">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,color-mix(in_oklab,var(--green)_24%,transparent),transparent_38%),radial-gradient(circle_at_85%_90%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_42%)]" />
              <img
                src="/icon-512x512.png"
                alt="The Voice Lounge app icon"
                width={512}
                height={512}
                className="mx-auto aspect-square w-[72%] rounded-[2rem] shadow-[0_28px_80px_-30px_rgba(0,0,0,.85)]"
              />
              <div className="mt-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">The Voice Lounge</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold">One tap from your Home Screen.</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Podcasts, video, live programming and discovery in a standalone app window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-[var(--section-gap)]" aria-labelledby="install-benefits">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Why install</p>
          <h2 id="install-benefits" className="mt-2 font-display text-[var(--step-4)] font-extrabold">
            The website, without the browser friction.
          </h2>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="hyper-glass card-lift rounded-3xl border border-hairline p-5">
              <div className="grid size-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--green)_12%,transparent)] text-[var(--green)]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell mt-[var(--section-gap)]">
        <div className="grain hyper-glass overflow-hidden rounded-[2rem] border border-hairline p-[clamp(1.5rem,4vw,3.5rem)] text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">Ready when you are</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-[var(--step-4)] font-extrabold leading-tight">
            Install once. Return to The Voice Lounge like any other app.
          </h2>
          <div className="mx-auto mt-6 max-w-sm">
            <InstallPwaButton fullWidth className="min-h-12 text-base" />
          </div>
        </div>
      </section>
    </div>
  );
}
