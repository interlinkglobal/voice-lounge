import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

const UPDATED = "19 September 2026";

const sections: LegalSection[] = [
  {
    title: "Who we are",
    body: (
      <>
        <p>
          This Privacy Policy explains how <strong>The Voice Lounge (Pty) Ltd.</strong> ("The Voice Lounge", "we", "us" or "our")
          handles personal information when you use our websites, Progressive Web App, account features, media experiences and related services.
        </p>
        <p>
          We operate from South Africa and process personal information in accordance with applicable South African privacy law, including the
          Protection of Personal Information Act, 2013 ("POPIA").
        </p>
      </>
    ),
  },
  {
    title: "Information we collect",
    body: (
      <>
        <p>Depending on how you use the service, we may collect:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li><strong>Account information:</strong> name, email address, profile image and provider identifier when you choose Google sign-in.</li>
          <li><strong>Usage information:</strong> pages viewed, searches, media interactions, saved items, playback state and feature preferences.</li>
          <li><strong>Device and technical information:</strong> browser, device type, approximate network information, diagnostics and security logs.</li>
          <li><strong>Communications:</strong> information you send through contact, newsletter, support or business-enquiry forms.</li>
          <li><strong>Cookie and local storage information:</strong> preferences, session state, consent choices and functionality required to operate the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Google sign-in",
    body: (
      <>
        <p>
          If you choose <strong>Continue with Google</strong>, Google authenticates you and returns the limited profile information you approve,
          currently including your Google account identifier, name, email address and profile image.
        </p>
        <p>
          The Voice Lounge does not receive or store your Google password. We use Google account information to authenticate you, maintain your
          session, display your profile and associate account-level features with the correct user.
        </p>
        <p>
          Our use of information received from Google APIs will comply with the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          , including applicable Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    title: "How we use personal information",
    body: (
      <>
        <p>We use personal information where necessary to:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>provide, secure and maintain The Voice Lounge;</li>
          <li>authenticate users and keep account sessions active;</li>
          <li>deliver search, discovery, playback, saved-content and preference features;</li>
          <li>respond to requests, enquiries and support messages;</li>
          <li>understand product performance and diagnose faults;</li>
          <li>prevent fraud, abuse, unauthorised access and security incidents;</li>
          <li>comply with legal, regulatory, accounting and reporting obligations; and</li>
          <li>send marketing communications where you have consented or where otherwise permitted by law.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Legal grounds and POPIA",
    body: (
      <>
        <p>
          We process personal information only where there is a lawful basis to do so. Depending on the context, this may include your consent,
          performance of a contract, compliance with a legal obligation, protection of a legitimate interest, or another basis permitted under POPIA.
        </p>
        <p>
          Where consent is the basis for processing, you may withdraw that consent. Withdrawal does not affect processing that was lawful before
          withdrawal.
        </p>
      </>
    ),
  },
  {
    title: "YouTube and third-party media",
    body: (
      <>
        <p>
          Video content on The Voice Lounge may be sourced from and played through YouTube. YouTube may process information when you interact with
          embedded or linked YouTube content. Those interactions are also governed by Google's and YouTube's applicable privacy terms.
        </p>
        <p>
          We may also use infrastructure, analytics, hosting, security, communication and content-delivery providers that process information on our
          behalf under appropriate contractual and security arrangements.
        </p>
      </>
    ),
  },
  {
    title: "Sharing personal information",
    body: (
      <>
        <p>We do not sell personal information. We may disclose information only where reasonably necessary to:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>service providers supporting hosting, authentication, security, analytics, communications or platform operations;</li>
          <li>professional advisers such as legal, audit or accounting providers;</li>
          <li>regulators, law-enforcement bodies or other authorities where disclosure is required or permitted by law;</li>
          <li>a successor or transaction counterparty in a legitimate corporate restructuring, acquisition or sale, subject to appropriate safeguards.</li>
        </ul>
      </>
    ),
  },
  {
    title: "International transfers",
    body: (
      <p>
        Some technology providers may process information outside South Africa. Where personal information is transferred across borders, we take
        reasonable steps to ensure that the transfer is permitted under POPIA and protected through contractual, organisational or other appropriate
        safeguards.
      </p>
    ),
  },
  {
    title: "Retention",
    body: (
      <p>
        We retain personal information only for as long as reasonably required for the purpose for which it was collected, to provide the service,
        resolve disputes, maintain security, satisfy legal obligations and enforce agreements. Retention periods vary by category and operational need.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        We use reasonable technical and organisational safeguards designed to protect personal information against loss, misuse, unauthorised access,
        disclosure, alteration or destruction. No internet service can guarantee absolute security, and users should also protect their devices,
        account access and authentication methods.
      </p>
    ),
  },
  {
    title: "Your privacy rights",
    body: (
      <>
        <p>Subject to applicable law, you may have the right to:</p>
        <ul className="grid list-disc gap-2 pl-5">
          <li>ask whether we hold personal information about you and request access to it;</li>
          <li>request correction or deletion of inaccurate, excessive, outdated or unlawfully processed information;</li>
          <li>object to certain processing or request restriction where applicable;</li>
          <li>withdraw consent where processing relies on consent;</li>
          <li>opt out of direct marketing; and</li>
          <li>lodge a complaint with South Africa's Information Regulator.</li>
        </ul>
        <p>
          Account and privacy controls may also be available through the <Link to="/account">Account</Link> area.
        </p>
      </>
    ),
  },
  {
    title: "Children",
    body: (
      <p>
        The Voice Lounge is a general-audience media service. We do not knowingly collect personal information from children where parental or
        guardian authorisation is legally required without the appropriate authorisation. If you believe a child has provided personal information
        contrary to applicable law, contact us so the matter can be reviewed.
      </p>
    ),
  },
  {
    title: "Changes and contact",
    body: (
      <>
        <p>
          We may update this Privacy Policy as the service, technology or legal requirements change. Material updates will be reflected by changing
          the "Last updated" date and, where appropriate, by providing an additional notice.
        </p>
        <p>
          For privacy requests, complaints or questions, use the contact and business-enquiry channels published on our{" "}
          <Link to="/about">About page</Link>. You may also contact the Information Regulator of South Africa directly regarding your statutory rights.
        </p>
      </>
    ),
  },
];

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | The Voice Lounge" },
      {
        name: "description",
        content: "How The Voice Lounge collects, uses, protects and shares personal information, including information used for Google sign-in.",
      },
      { property: "og:title", content: "Privacy Policy | The Voice Lounge" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy & POPIA"
      title="Privacy Policy"
      summary="How The Voice Lounge collects, uses, protects and manages personal information across our website, app experience and account services."
      updated={UPDATED}
      sections={sections}
      relatedLabel="Read Terms of Service"
      relatedTo="/terms-of-service"
    />
  );
}
