export type ContactKind =
  | "gmail"
  | "x"
  | "instagram"
  | "github"
  | "gitlab"
  | "facebook"
  | "whatsapp"
  | "discord"
  | "telegram"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "web";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_ICON_URLS: Record<Exclude<ContactKind, "web">, string> = {
  gmail: "https://cdn.simpleicons.org/gmail/EA4335",
  x: "https://cdn.simpleicons.org/x/FFFFFF",
  instagram: "https://cdn.simpleicons.org/instagram/E4405F",
  github: "https://cdn.simpleicons.org/github/FFFFFF",
  gitlab: "https://cdn.simpleicons.org/gitlab/FC6D26",
  facebook: "https://cdn.simpleicons.org/facebook/1877F2",
  whatsapp: "https://cdn.simpleicons.org/whatsapp/25D366",
  discord: "https://cdn.simpleicons.org/discord/5865F2",
  telegram: "https://cdn.simpleicons.org/telegram/26A5E4",
  linkedin: "https://cdn.simpleicons.org/linkedin/0A66C2",
  tiktok: "https://cdn.simpleicons.org/tiktok/FFFFFF",
  youtube: "https://cdn.simpleicons.org/youtube/FF0000",
};

function normalizeForMatch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
}

export function isEmailValue(value: string) {
  return emailPattern.test(value.trim());
}

export function toContactHref(value: string) {
  const normalized = value.trim();
  if (!normalized) return "#";
  if (/^mailto:/i.test(normalized)) return normalized;
  if (isEmailValue(normalized)) return `mailto:${normalized}`;
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `https://${normalized}`;
}

export function getContactKind(value: string): ContactKind {
  const raw = value.trim().toLowerCase();
  if (raw.startsWith("mailto:")) return "gmail";
  if (isEmailValue(value)) return "gmail";

  const normalized = normalizeForMatch(value);
  if (normalized.startsWith("x.com/") || normalized.startsWith("twitter.com/")) return "x";
  if (normalized.startsWith("instagram.com/")) return "instagram";
  if (normalized.startsWith("github.com/")) return "github";
  if (normalized.startsWith("gitlab.com/")) return "gitlab";
  if (normalized.startsWith("facebook.com/") || normalized.startsWith("fb.com/")) return "facebook";
  if (
    normalized.startsWith("whatsapp.com/") ||
    normalized.startsWith("api.whatsapp.com/") ||
    normalized.startsWith("wa.me/")
  ) {
    return "whatsapp";
  }
  if (normalized.startsWith("discord.com/") || normalized.startsWith("discord.gg/")) return "discord";
  if (normalized.startsWith("telegram.me/") || normalized.startsWith("t.me/")) return "telegram";
  if (normalized.startsWith("linkedin.com/")) return "linkedin";
  if (normalized.startsWith("tiktok.com/")) return "tiktok";
  if (normalized.startsWith("youtube.com/") || normalized.startsWith("youtu.be/")) return "youtube";

  return "web";
}
