export type AnalyticsEvent = 'chapter_viewed' | 'service_selected' | 'package_selected' | 'itinerary_opened' | 'enquiry_submitted' | 'whatsapp_continued';
declare global { interface Window { dataLayer?: Array<Record<string, unknown>>; } }
const piiKeys = ['name', 'mobile', 'email', 'notes', 'message'];
export function track(event: AnalyticsEvent, metadata: Record<string, string | number | boolean> = {}): void {
  const safeMetadata = Object.fromEntries(Object.entries(metadata).filter(([key]) => !piiKeys.includes(key)));
  window.dataLayer?.push({ event, ...safeMetadata });
  window.dispatchEvent(new CustomEvent('dreamdrifters:analytics', { detail: { event, ...safeMetadata } }));
}
