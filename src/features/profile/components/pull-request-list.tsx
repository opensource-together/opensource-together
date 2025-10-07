import { UserPullRequest } from "../types/profile.type";
import PullRequestCard from "./pull-request-card";

export default function PullRequestList({
  provider,
  list,
}: {
  provider: "github" | "gitlab";
  list: UserPullRequest[];
}) {
  if (!list || list.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        {list.map((pr, idx) => (
          <PullRequestCard
            key={`${pr.url}-${idx}`}
            pr={pr}
            provider={provider}
          />
        ))}
      </div>
    </div>
  );
}
