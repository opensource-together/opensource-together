import Link from "next/link";
import { type ComponentType } from "react";
import { HiMiniLink } from "react-icons/hi2";
import {
  RiGithubFill,
  RiGitlabFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";

type LinkSource = {
  githubUrl?: string | null;
  gitlabUrl?: string | null;
  discordUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
};

type LinkConfig = {
  key: keyof LinkSource;
  Icon: ComponentType<{ size?: number }>;
  alt: string;
};

const LINK_CONFIG: ReadonlyArray<LinkConfig> = [
  { key: "githubUrl", Icon: RiGithubFill, alt: "GitHub" },
  { key: "gitlabUrl", Icon: RiGitlabFill, alt: "GitLab" },
  { key: "twitterUrl", Icon: RiTwitterXFill, alt: "Twitter/X" },
  { key: "linkedinUrl", Icon: RiLinkedinFill, alt: "LinkedIn" },
  { key: "discordUrl", Icon: RxDiscordLogo, alt: "Discord" },
  { key: "websiteUrl", Icon: HiMiniLink, alt: "Website" },
] as const;

const isFilled = (v?: string | null) =>
  typeof v === "string" && v.trim().length > 0;

const ensureProtocol = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

const formatUrl = (raw: string) => {
  try {
    const u = new URL(ensureProtocol(raw));
    return `${u.hostname}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return raw;
  }
};

export function ExternalLinks({ source }: { source: LinkSource }) {
  const hasAny = LINK_CONFIG.some(({ key }) => isFilled(source[key]));
  if (!hasAny)
    return <p className="text-muted-foreground text-sm">No links added</p>;

  return (
    <div className="mb-2 flex flex-col">
      <div className="flex flex-col gap-4">
        {LINK_CONFIG.map(({ key, Icon, alt }) => {
          const raw = source[key];
          if (!isFilled(raw)) return null;

          const href = ensureProtocol(raw as string);
          return (
            <Link
              key={String(key)}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
              title={alt}
              aria-label={alt}
            >
              <div className="text-muted-foreground hover:text-muted-foreground/80 flex items-center gap-1.5 rounded-full text-sm tracking-tight transition-colors">
                <div className="flex-shrink-0">
                  <Icon size={20} aria-hidden />
                </div>
                <span className="truncate">{formatUrl(raw as string)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
