export const PODCAST_STOCK_IMAGES = [
  "https://img.freepik.com/free-photo/man-with-microphone-headphones-running-podcast-studio_23-2149434249.jpg",
  "https://img.freepik.com/free-photo/nobody-podcast-production-studio-with-professional-microphone-headphones-streaming-interview-internet-radio-empty-desk-with-streaming-equipment-broadcast-live-show-social-media_482257-48491.jpg",
  "https://img.freepik.com/free-photo/close-up-shot-focused-preview-image-professional-camera-with-podcast-host-african-american-guest-enjoying-conversation-blurry-background-professional-recording-equipment-home-studio_482257-74318.jpg",
  "https://img.freepik.com/free-photo/portrait-online-radio-host-smiling-confident-camera-while-broadcasting-live-using-professional-equipment-recording-studio-african-american-podcaster-sitting-desk-with-boom-arm-microphone_482257-51216.jpg",
  "https://img.freepik.com/free-photo/flat-lay-composition-with-microphone-podcasts-black-studio-headphones-yellow-background-with-coffee-learning-online-education-concept_501050-1073.jpg",
  "https://img.freepik.com/free-photo/female-host-communicating-microphone-woman-radio-studio_1157-47587.jpg",
  "https://img.freepik.com/free-photo/professional-microphone-sound-recording-macro-photography_169016-23351.jpg",
] as const;

export const CREATOR_PROFILE_IMAGES = [
  "https://img.magnific.com/free-photo/businesswoman-executive-professional-success-concept_53876-137644.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.magnific.com/free-photo/happy-businesswoman-with-hand-chin_1262-20885.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.magnific.com/free-photo/african-american-business-woman-by-window_1303-10869.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.magnific.com/free-photo/front-view-formal-male-journalist_23-2149029389.jpg",
  "https://img.freepik.com/free-photo/portrait-online-radio-host-smiling-confident-camera-while-broadcasting-live-using-professional-equipment-recording-studio-african-american-podcaster-sitting-desk-with-boom-arm-microphone_482257-51216.jpg",
  "https://img.freepik.com/free-photo/female-host-communicating-microphone-woman-radio-studio_1157-47587.jpg",
  "https://img.freepik.com/free-photo/man-with-microphone-headphones-running-podcast-studio_23-2149434249.jpg",
  "https://img.magnific.com/free-photo/portrait-corporate-woman-working-with-laptop-smiling-looking-assertive-white-background_1258-123334.jpg",
  "https://img.magnific.com/free-photo/portrait-happy-manager-holding-leather-case_1262-5329.jpg",
  "https://img.magnific.com/free-photo/businesswoman-executive-professional-success-concept_53876-137644.jpg?semt=ais_hybrid&w=740&q=80",
] as const;

function hash(value: string) {
  let out = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    out ^= value.charCodeAt(i);
    out = Math.imul(out, 16777619);
  }
  return out >>> 0;
}

export function stockImageForSeed(seed: string, offset = 0) {
  const creatorLike = /creator|host|profile|voice|contributor|diary/i.test(seed);
  const pool = creatorLike ? CREATOR_PROFILE_IMAGES : PODCAST_STOCK_IMAGES;
  return pool[(hash(seed) + offset) % pool.length] ?? pool[0];
}
