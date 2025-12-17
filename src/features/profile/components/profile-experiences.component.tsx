import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

import { cn } from "@/shared/lib/utils";

import type { UserExperience } from "../types/profile.type";

interface ProfileExperiencesProps {
  title?: string;
  experiences?: UserExperience[];
  className?: string;
}

function formatRange(exp: UserExperience): string {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "Current";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" }); // ex: Oct 2024
  };

  const start = formatDate(exp.startAt);
  const end = exp.endAt ? formatDate(exp.endAt) : "Current";

  return `${start} — ${end}`;
}
export default function ProfileExperiences({
  title = "Work Experience",
  experiences = [],
  className,
}: ProfileExperiencesProps) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section className={cn("mt-12 w-full", className)}>
      <h3 className="font-medium">{title}</h3>
      <div className="flex w-full flex-col">
        {experiences.map((exp, idx) => (
          <div
            key={`${exp.title}-${idx}`}
            className="mt-4 grid grid-cols-1 items-center gap-4 py-1 md:grid-cols-[auto_1fr_auto]"
          >
            <div className="text-muted-foreground">
              <span className="whitespace-nowrap text-[15px]">
                {formatRange(exp)}
              </span>
            </div>
            <div className="relative hidden h-px w-full bg-muted md:block" />
            <div className="flex min-w-0 items-center justify-end gap-2">
              {exp.url ? (
                <Link
                  href={exp.url}
                  className="inline-flex max-w-full items-center gap-2 whitespace-nowrap font-medium text-[15px] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="truncate">{exp.title}</span>
                  <LuExternalLink className="size-3.5 shrink-0" />
                </Link>
              ) : (
                <span className="truncate whitespace-nowrap font-medium text-[15px]">
                  {exp.title}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
