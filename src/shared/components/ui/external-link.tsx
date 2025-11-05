import Link from "next/link";
import { ComponentType } from "react";
import { HiMiniLink } from "react-icons/hi2";
import {
  RiGithubFill,
  RiGitlabFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";

import {
  type ExternalLinkType,
  ensureExternalUrlProtocol,
  formatExternalUrl,
} from "@/shared/lib/utils/format-external-url";

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

export function ExternalLinks({
  source,
  title,
  emptyText,
}: {
  source: LinkSource;
  title?: string;
  emptyText?: string;
}) {
  const hasAnyLink = LINK_CONFIG.some(({ key }) => isFilled(source[key]));

  return (
    <div className="mb-2 flex flex-col">
      {title && <h2 className="mb-3 text-sm">{title}</h2>}
      <div className="flex flex-col gap-4">
        {LINK_CONFIG.map(({ key, Icon, alt }) => {
          const raw = source[key];
          if (!isFilled(raw)) return null;

          const href = ensureExternalUrlProtocol(raw as string);
          return (
            <Link
              key={String(key)}
              href={href}
              target="_blank"
              title={alt}
              aria-label={alt}
              className="min-w-0"
            >
              <div className="text-muted-foreground hover:text-muted-foreground/80 flex items-center gap-1.5 rounded-full text-sm tracking-tight transition-colors">
                <span className="flex min-w-0 items-center gap-1 rounded-full border px-2 py-px">
                  <Icon size={14} />
                  <span className="truncate">
                    {formatExternalUrl(raw as string, key as ExternalLinkType)}
                  </span>
                </span>
              </div>
            </Link>
          );
        })}

        {!hasAnyLink && emptyText && (
          <p className="text-muted-foreground text-sm">{emptyText}</p>
        )}
      </div>
    </div>
  );
}
