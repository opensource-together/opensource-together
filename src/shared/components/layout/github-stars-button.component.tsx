import { HiStar } from "react-icons/hi2";
import { RiGithubFill } from "react-icons/ri";

import { Button } from "@/shared/components/ui/button";
import { EXTERNAL_LINKS } from "@/shared/lib/constants";
import { formatNumberShort } from "@/shared/lib/utils/format-number";

interface GithubStarsButtonProps {
  stars: number | null;
}

export default function GithubStarsButton({ stars }: GithubStarsButtonProps) {
  return (
    <Button asChild variant="ghost" size="sm">
      <a
        href={EXTERNAL_LINKS.GITHUB_REPO}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          stars == null
            ? "Star OpenSource Together on GitHub"
            : `Star OpenSource Together on GitHub (${stars} stars)`
        }
      >
        <RiGithubFill className="size-4.5" />
        {stars != null && (
          <span className="flex items-center gap-0.5 tabular-nums">
            <HiStar className="size-3.5" />
            {formatNumberShort(stars)}
          </span>
        )}
      </a>
    </Button>
  );
}
