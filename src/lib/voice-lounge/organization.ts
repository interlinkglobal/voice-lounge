export const VOICE_LOUNGE = {
  name: "The Voice Lounge",
  tagline: "The Eastern Cape's Voice, Amplified",
  description:
    "An East London multimedia organisation spanning online radio, video podcasts and interviews, recording-studio work, editorial coverage, a record label, mobile applications and commercial media products.",
  market: {
    city: "East London",
    municipality: "Buffalo City",
    province: "Eastern Cape",
    country: "South Africa",
  },
  onlineRadioLaunchDate: "2025-08-01",
  publicWebsite: "https://www.thevoicelounge.co.za/",
  contact: {
    phone: "043 050 6570",
    mobile: "+27 83 950 7019",
    email: "Info@thevoicelounge.co.za",
    talentEmail: "talent@thevoicelounge.co.za",
    addressStatus:
      "Public sources conflict between Baysville and Vincent addresses; do not publish a street address until management confirms the current location.",
  },
  socials: [
    { platform: "Facebook", url: "https://www.facebook.com/TheVoiceLoungeza/" },
    { platform: "YouTube", url: "https://www.youtube.com/@THEVOICELOUNGE" },
    { platform: "X", url: "https://x.com/TheVoiceLounge" },
  ],
  apps: [
    {
      platform: "Android",
      label: "Google Play",
      url: "https://play.google.com/store/apps/details?id=com.thevoicelounge.app",
      id: "com.thevoicelounge.app",
    },
    {
      platform: "iOS",
      label: "App Store",
      url: "https://apps.apple.com/za/app/the-voice-lounge/id6752489276",
      id: "6752489276",
    },
  ],
  premium: {
    trialDays: 7,
    monthlyPriceZar: 9.99,
    publiclyAdvertisedBenefits: [
      "Uninterrupted live streaming",
      "Studio audio",
      "Exclusive podcasts",
      "Premium podcast back-catalogues",
      "Broadcaster shout-out functionality",
      "Real-time notifications and reminders",
    ],
  },
  pillars: [
    "Online radio and live broadcasting",
    "Video podcasts and interviews",
    "Recording studio and music production",
    "News and editorial coverage",
    "Record-label and artist development",
    "Mobile applications",
    "Advertising and commercial media products",
  ],
} as const;

export const VERIFIED_SOCIALS = VOICE_LOUNGE.socials;
export const VERIFIED_APPS = VOICE_LOUNGE.apps;
