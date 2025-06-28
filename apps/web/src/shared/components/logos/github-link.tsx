import Link from "next/link";
import { RxGithubLogo } from "react-icons/rx";

interface GithubLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function GithubLink({
  url,
  size = 5,
  className,
}: GithubLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-1 text-sm tracking-tighter ${className}`}
      target="_blank"
      aria-label="GitHub"
    >
      <RxGithubLogo
        className={`size-${size} transition-colors duration-200 hover:text-black/70`}
      />
    </Link>
  );
}
