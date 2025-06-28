import Link from "next/link";
import { RxLinkedinLogo } from "react-icons/rx";

interface LinkedinLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function LinkedinLink({
  url,
  size = 5,
  className,
}: LinkedinLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="LinkedIn"
    >
      <RxLinkedinLogo
        className={`size-${size} transition-colors duration-200 hover:text-black/70`}
      />
    </Link>
  );
}
