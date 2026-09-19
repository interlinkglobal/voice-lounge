import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

const UPDATED = "19 September 2026";

const sections: LegalSection[] = [
  {
    title: "Agreement to these terms",
    body: (
      <p>
        These Terms of Service ("Terms") govern your access to and use of The Voice Lounge websites, Progressive Web App, accounts, media players and
        related services. By using the service, you agree to these Terms. If you do not agree, do not use the service.
      </p>
    ),
  },
  {
    title: "About The Voice Lounge",
    body: (
      <p>
        The Voice Lounge is a South African media platform for podcasts, video, live programming, editorial content, discovery and related community
        experiences. References to "The Voice Lounge", "we", "us" or "our" mean The Voice Lounge (Pty) Ltd. and its applicable service operators.
      </p>
    ),
  },
  {
    title: "Eligibility and accounts",
    body: (
      <>
        <p>
          You must be legally capable of entering into these Terms or use the service with the consent and supervision required by applicable law.
          Certain features may have additional age or eligibility requirements.
        </p>
        <p>
          You are responsible for activity under your account and for maintaining control of the authentication methods used to access it. Notify us
          promptly if you believe your account has been compromised.
        </p>
      </>
    ),
  },
  {
    title: "Google sign-in",
    body: (
      <>
        <p>
          The Voice Lounge may allow you to sign in using Google. Google authentication is provided by Google under its own terms and policies.
          The Voice Lounge receives only the account information authorised through the sign-in flow and does not receive your Google password.
        </p>
        <p>
          You may stop using Google sign-in by signing out of The Voice Lounge and, where applicable, managing connected-app permissions through your
          Google account.
        </p>
      </>
    ),
  },
  {
    title: "Content and media services",
    body: (
      <>
        <p>
          The service may include audio, video, live streams, editorial material, artwork, metadata, recommendations and links supplied by The Voice
          Lounge, creators, licensors or third-party platforms.
        </p>
        <p>
          YouTube content displayed or played through The Voice Lounge remains subject to YouTube's applicable terms. Availability may change if a
          creator, rights holder or platform removes, restricts or modifies content.
        </p>
      </>
    ),
  },
  {
    title: "Acceptable use",
    body: (
      <>
        <p>You may not use The Voice Lounge to:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>break applicable law or infringe another person's rights;</li>
          <li>circumvent access controls, security measures, usage restrictions or technical protections;</li>
          <li>scrape, crawl, copy or extract the service at scale except where expressly permitted by us or applicable law;</li>
          <li>upload or distribute malware, harmful code or content intended to disrupt the service;</li>
          <li>impersonate another person or misrepresent your affiliation;</li>
          <li>harass, threaten or unlawfully target creators, users or staff; or</li>
          <li>use the service in a way that materially interferes with its operation or other users.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Intellectual property",
    body: (
      <>
        <p>
          The Voice Lounge service, branding, interface, software, editorial presentation and original materials are protected by intellectual
          property laws. Rights in third-party content remain with the applicable creators, licensors and platforms.
        </p>
        <p>
          These Terms give you a limited, revocable, non-exclusive right to use the service for its intended personal or authorised business purpose.
          They do not transfer ownership of our intellectual property or third-party content to you.
        </p>
      </>
    ),
  },
  {
    title: "User submissions and community features",
    body: (
      <p>
        If community, comment, playlist, profile or submission features allow you to provide content, you remain responsible for what you submit and
        must have the rights required to do so. You must not submit unlawful, infringing, deceptive, abusive or malicious material. Additional
        community guidelines may apply to specific features.
      </p>
    ),
  },
  {
    title: "Premium services and payments",
    body: (
      <>
        <p>
          Some features may be offered as paid or premium services. Where a real purchase is available, the price, billing cycle, renewal terms,
          cancellation process and any material restrictions will be shown before you commit to payment.
        </p>
        <p>
          Demonstration or preview checkout interfaces do not create a charge unless the interface clearly identifies a live payment flow and asks
          you to confirm a purchase.
        </p>
      </>
    ),
  },
  {
    title: "Service changes and availability",
    body: (
      <p>
        We may add, remove, improve, suspend or modify features, content and integrations. We aim to provide a reliable service but do not guarantee
        uninterrupted availability of every feature, third-party integration, live event or item of media. Maintenance, rights changes, security
        incidents and provider outages may affect availability.
      </p>
    ),
  },
  {
    title: "Suspension and termination",
    body: (
      <p>
        We may restrict or terminate access where reasonably necessary to protect users, rights holders, the service or the public; to respond to
        unlawful activity; or to address serious or repeated breaches of these Terms. Where appropriate and legally required, we will provide notice
        or an opportunity to address the issue.
      </p>
    ),
  },
  {
    title: "Disclaimers and liability",
    body: (
      <>
        <p>
          The service is provided on an "as available" basis to the extent permitted by law. Editorial, entertainment and informational content is
          not a substitute for professional legal, financial, medical or other regulated advice.
        </p>
        <p>
          To the maximum extent permitted by applicable law, The Voice Lounge is not liable for indirect, incidental or consequential loss arising
          solely from use of, or inability to use, the service. Nothing in these Terms excludes rights or remedies that cannot lawfully be excluded,
          including rights under applicable South African consumer-protection law.
        </p>
      </>
    ),
  },
  {
    title: "Privacy",
    body: (
      <p>
        Our handling of personal information is described in the <Link to="/privacy-policy">Privacy Policy</Link>. By using account and platform
        features, you acknowledge that personal information will be processed as described there and in notices shown at the point of collection.
      </p>
    ),
  },
  {
    title: "Governing law",
    body: (
      <p>
        These Terms are governed by the laws of the Republic of South Africa, subject to any mandatory rights that apply to you under other
        applicable law. Disputes will be handled by courts or recognised dispute-resolution bodies with jurisdiction, unless the parties agree to an
        appropriate alternative process.
      </p>
    ),
  },
  {
    title: "Changes and contact",
    body: (
      <>
        <p>
          We may update these Terms as the service or legal requirements change. The current version will be published on this route with a revised
          "Last updated" date. Material changes may also be communicated through the service.
        </p>
        <p>
          For legal, support or business questions, use the contact channels published on our <Link to="/about">About page</Link>.
        </p>
      </>
    ),
  },
];

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service | The Voice Lounge" },
      {
        name: "description",
        content: "Terms governing access to and use of The Voice Lounge, including accounts, Google sign-in, media playback and premium services.",
      },
      { property: "og:title", content: "Terms of Service | The Voice Lounge" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      summary="The rules and conditions that govern access to The Voice Lounge, our media experiences, accounts and related services."
      updated={UPDATED}
      sections={sections}
      relatedLabel="Read Privacy Policy"
      relatedTo="/privacy-policy"
    />
  );
}
