import Image from "next/image";
import Link from "next/link";

interface LinkedinLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function LinkedinLink({
  url,
  size = 18,
  className,
}: LinkedinLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="LinkedIn"
    >
      <Image
        src="/icons/linkedin.svg"
        alt="linkedin"
        width={size}
        height={size}
      />
    </Link>
  );
}
