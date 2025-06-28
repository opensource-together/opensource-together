import Image from "next/image";
import Link from "next/link";

interface TwitterLinkProps {
  url: string;
  size?: number;
  className?: string;
}

export default function TwitterLink({
  url,
  size = 18,
  className,
}: TwitterLinkProps) {
  return (
    <Link href={url} className={className} target="_blank" aria-label="Twitter">
      <Image
        src="/icons/twitter.svg"
        alt="twitter"
        width={size}
        height={size}
      />
    </Link>
  );
}
