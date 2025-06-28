import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

interface TwitterLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function TwitterLink({
  url,
  size = 5,
  className,
}: TwitterLinkProps) {
  return (
    <Link href={url} className={className} target="_blank" aria-label="Twitter">
      <FaXTwitter
        className={`size-${size} transition-colors duration-200 hover:text-black/70`}
      />
    </Link>
  );
}
