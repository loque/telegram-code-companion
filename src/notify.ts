const NOTIFY_EMOJI_PREFIX = "🔔";

// Keep notify formatting in one place so all outbound messages stay consistent.
export function formatNotifyMessage(message: string): string {
  return `${NOTIFY_EMOJI_PREFIX} ${message.trim()}`;
}
