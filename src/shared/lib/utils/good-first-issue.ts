import type { Issue } from "../../../features/projects/types/project.type";

const RAW_GOOD_FIRST_LABELS = [
  "good first issue",
  "good-first-issue",
  "good first issues",
  "good-first issues",
  "good-first task",
];

const normalize = (label: string) => label.trim().toLowerCase();

const GOOD_FIRST_LABELS_SET = new Set(
  RAW_GOOD_FIRST_LABELS.map((label) => normalize(label))
);

export const GOOD_FIRST_BADGE_LABEL = "Good first issue";

export function isGoodFirstIssue(issue: Issue): boolean {
  if (!issue.labels?.length) {
    return false;
  }

  return issue.labels.some((label) =>
    GOOD_FIRST_LABELS_SET.has(normalize(label))
  );
}
