import Link from "next/link";

import { Icon, IconSize, IconVariant } from "../ui/icon";

interface TwitterLinkProps {
  url: string;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  interactive?: boolean;
}

export default function TwitterLink({
  url,
  size = "md",
  variant = "black",
  className = "",
  interactive = true,
}: TwitterLinkProps) {
  return (
    <Link href={url} className={className} target="_blank" aria-label="Twitter">
      <Icon
        name="twitter"
        size={size}
        variant={variant}
        interactive={interactive}
      />
    </Link>
  );
}
