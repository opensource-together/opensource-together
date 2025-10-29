import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

import { cn } from "@/shared/lib/utils";

import { UserExperience } from "../types/profile.type";

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
    <section className={cn("w-full", className)}>
      <h3 className="font-medium">{title}</h3>
      <div className="flex w-full flex-col">
        {experiences.map((exp, idx) => (
          <div
            key={`${exp.title}-${idx}`}
            className="mt-4 grid grid-cols-1 items-center gap-4 py-1 md:grid-cols-12"
          >
            <div className="text-muted-foreground md:col-span-3">
              <span className="text-[15px] whitespace-nowrap">
                {formatRange(exp)}
              </span>
            </div>
            <div className="bg-muted relative hidden h-px w-full md:col-span-6 md:block" />
            <div className="flex items-center gap-2 md:col-span-3">
              {exp.url ? (
                <Link
                  href={exp.url}
                  className="inline-flex items-center gap-2 text-[15px] font-medium whitespace-nowrap hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {exp.title}
                  <LuExternalLink className="size-3.5" />
                </Link>
              ) : (
                <span className="text-[15px] font-medium whitespace-nowrap">
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
