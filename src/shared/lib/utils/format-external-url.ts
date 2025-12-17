/**
 * Format external URLs for display in a clean, readable format.
 * Each platform has its own formatting rules for better UX.
 */

export type ExternalLinkType =
  | "githubUrl"
  | "gitlabUrl"
  | "discordUrl"
  | "twitterUrl"
  | "linkedinUrl"
  | "websiteUrl";

/**
 * Ensure URL has a protocol (https://) if missing
 */
const ensureProtocol = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

/**
 * Format external URLs based on platform type
 */
export function formatExternalUrl(raw: string, type: ExternalLinkType): string {
  try {
    const u = new URL(ensureProtocol(raw));

    // Special formatting for Twitter/X
    if (type === "twitterUrl") {
      const pathname = u.pathname.replace(/\/$/, "");
      if (pathname.startsWith("/")) {
        return `@${pathname.slice(1)}`;
      }
      return `@${pathname}`;
    }

    // Special formatting for GitHub and GitLab - remove domain
    if (type === "githubUrl" || type === "gitlabUrl") {
      return u.pathname.replace(/\/$/, "").replace(/^\//, "");
    }

    // Special formatting for Discord - show server/user prefix
    if (type === "discordUrl") {
      const pathname = u.pathname.replace(/\/$/, "").replace(/^\//, "");
      // Handle different Discord URL formats
      if (pathname.startsWith("users/")) {
        // discord.com/users/123456789 -> users/123456789
        return `users/${pathname.split("/").pop()}`;
      }
      if (pathname.startsWith("invite/")) {
        // discord.gg/invite/code -> invite/code
        return `invite/${pathname.split("/").pop()}`;
      }
      // discord.gg/code -> invite/code
      return `invite/${pathname}`;
    }

    // Special formatting for LinkedIn - extract profile/company name
    if (type === "linkedinUrl") {
      const pathname = u.pathname.replace(/\/$/, "").replace(/^\//, "");
      // Handle LinkedIn URL formats
      if (pathname.startsWith("in/")) {
        // linkedin.com/in/username -> in/username
        return pathname;
      }
      if (pathname.startsWith("company/")) {
        // linkedin.com/company/companyname -> company/companyname
        return pathname;
      }
      // linkedin.com/username -> username
      return pathname;
    }

    // Default formatting for website and other platforms
    return `${u.hostname}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return raw;
  }
}

/**
 * Ensure URL has proper protocol for external links
 */
export function ensureExternalUrlProtocol(url: string): string {
  return ensureProtocol(url);
}
