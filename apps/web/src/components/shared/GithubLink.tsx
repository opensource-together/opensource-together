import Image from "next/image";
import Link from "next/link";

interface GithubLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function GithubLink({
  url,
  size = 18,
  className,
}: GithubLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="GitHub"
    >
      Star Us
      <Image src="/icons/github.svg" alt="github" width={size} height={size} />
    </Link>
  );
}
