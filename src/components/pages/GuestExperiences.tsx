import { Link } from "@tanstack/react-router";
import { ExternalLink, Globe2, Linkedin, Youtube } from "lucide-react";
import { SmartImage } from "@/components/media/SmartImage";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { buildGuestDirectory, guestBySlug, videosForGuest } from "@/lib/content/guests";

export function GuestsDirectoryExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const guests = buildGuestDirectory(videos);

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="guests">
      <div className="mb-5 border-b border-hairline pb-4">
        <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.05em]">Voice Lounge guests</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Guests recovered from the legacy Voice Lounge catalogue, project research and official YouTube metadata. New guest metadata can appear automatically as the channel publishes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {guests.map((guest) => (
          <Link
            key={guest.slug}
            to="/guests/$slug"
            params={{ slug: guest.slug }}
            className="press group border border-hairline bg-card/40 p-4 transition-colors hover:border-[color-mix(in_oklab,var(--green)_48%,var(--hairline))]"
          >
            <div className="flex items-start gap-4">
              <SmartImage
                src={guest.image}
                fallbackRatio="1:1"
                alt={guest.image ? `${guest.name} Voice Lounge appearance` : ""}
                className="size-24 shrink-0 rounded-full border border-hairline bg-black object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <h2 className="font-display text-xl font-black group-hover:underline">{guest.name}</h2>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{guest.description}</p>
                <p className="mt-3 text-xs font-semibold text-[var(--green)]">
                  {guest.appearanceCount ? `${guest.appearanceCount} matched appearance${guest.appearanceCount === 1 ? "" : "s"}` : "Profile ready for media"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuestDetailExperience({ slug }: { slug: string }) {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const guest = guestBySlug(videos, slug);

  if (!guest) {
    return (
      <div className="shell grid min-h-[65vh] place-items-center py-12 text-center">
        <div>
          <h1 className="font-display text-3xl font-black">Guest not found</h1>
          <Link to="/guests" className="press mt-5 inline-flex min-h-11 items-center border border-hairline px-5 text-sm font-bold">Back to guests</Link>
        </div>
      </div>
    );
  }

  const appearances = videosForGuest(videos, guest);

  return (
    <article className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2.5rem)]">
      <header className="grid gap-6 border-b border-hairline pb-[clamp(1.5rem,4vw,3rem)] md:grid-cols-[12rem_minmax(0,1fr)] md:items-center">
        <SmartImage
          src={guest.image}
          fallbackRatio="1:1"
          alt={guest.image ? `${guest.name} Voice Lounge appearance` : ""}
          className="aspect-square w-full max-w-48 rounded-full border border-hairline bg-black object-cover"
        />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--green)]">Voice Lounge guest</p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[.92] tracking-[-0.055em]">{guest.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{guest.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {guest.links?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-4 text-sm font-bold"
              >
                {link.kind === "linkedin" ? <Linkedin className="size-4" aria-hidden="true" /> : <Globe2 className="size-4" aria-hidden="true" />}
                {link.label}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-[clamp(1.5rem,4vw,3rem)]" aria-labelledby="guest-appearances">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--green)]">Official channel</p>
            <h2 id="guest-appearances" className="font-display text-2xl font-black">Voice Lounge appearances</h2>
          </div>
          <a href="https://www.youtube.com/@THEVOICELOUNGE" target="_blank" rel="noreferrer" className="press inline-flex min-h-10 items-center gap-2 border border-hairline px-3 text-xs font-bold">
            <Youtube className="size-4" aria-hidden="true" /> Channel
          </a>
        </div>

        {appearances.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {appearances.map((video, index) => (
              <YouTubeVideoCard key={video.id} video={video} priority={index < 3} animate={false} className="w-full" />
            ))}
          </div>
        ) : (
          <div className="border border-hairline p-6 text-sm leading-6 text-muted-foreground">
            No current upload title or description matched this guest by name. The profile remains listed from verified legacy/research evidence and can be enriched by administrators later.
          </div>
        )}
      </section>
    </article>
  );
}
