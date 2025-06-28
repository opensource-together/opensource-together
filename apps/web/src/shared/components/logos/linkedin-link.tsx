import Link from "next/link";

import { Icon, IconSize, IconVariant } from "../ui/icon";

interface LinkedinLinkProps {
  url: string;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  interactive?: boolean;
}

export default function LinkedinLink({
  url,
  size = "md",
  variant = "black",
  className = "",
  interactive = true,
}: LinkedinLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="LinkedIn"
    >
      <Icon
        name="linkedin"
        size={size}
        variant={variant}
        interactive={interactive}
      />
    </Link>
  );
}
