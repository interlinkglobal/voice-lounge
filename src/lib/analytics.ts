/**
 * Analytics abstraction. No third-party script is loaded — events are buffered
 * and handed to a provider once one is configured.
 */
export type AnalyticsEvent =
  | "impression"
  | "card_click"
  | "watch_click"
  | "watch_unavailable"
  | "play"
  | "pause"
  | "progress_25"
  | "progress_50"
  | "progress_75"
  | "completed"
  | "video_play"
  | "search"
  | "follow"
  | "unfollow"
  | "save"
  | "share"
  | "premium_view"
  | "premium_cta"
  | "newsletter_signup"
  | "news_open"
  | "live_reminder"
  | "theme_change";

type Payload = Record<string, string | number | boolean | undefined>;
type Sink = (event: AnalyticsEvent, payload: Payload) => void;

const buffer: Array<{ event: AnalyticsEvent; payload: Payload; at: number }> = [];
let sink: Sink | null = null;

export function registerAnalyticsSink(fn: Sink) {
  sink = fn;
  buffer.splice(0).forEach((b) => fn(b.event, b.payload));
}

export function track(event: AnalyticsEvent, payload: Payload = {}) {
  if (sink) sink(event, payload);
  else {
    buffer.push({ event, payload, at: Date.now() });
    if (buffer.length > 200) buffer.shift();
  }
}
