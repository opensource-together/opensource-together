import Link from "next/link";

import { Icon, IconSize, IconVariant } from "../ui/icon";

interface GithubLinkProps {
  url: string;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  interactive?: boolean;
}

export default function GithubLink({
  url,
  size = "md",
  variant = "black",
  className = "",
  interactive = true,
}: GithubLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="GitHub"
    >
      <Icon
        name="github"
        size={size}
        variant={variant}
        interactive={interactive}
      />
    </Link>
  );
}
