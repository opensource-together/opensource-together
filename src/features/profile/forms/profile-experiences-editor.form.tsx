import Link from "next/link";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ExperienceItem {
  title: string;
  startAt: string;
  endAt?: string | null;
  url?: string | null;
}

interface ProfileExperiencesEditorProps {
  title?: string;
  experiences: ExperienceItem[];
  className?: string;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function formatRange(exp: ExperienceItem): string {
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "Current";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const start = formatDate(exp.startAt);
  const end = exp.endAt ? formatDate(exp.endAt) : "Current";

  return `${start} — ${end}`;
}

export default function ProfileExperiencesEditor({
  title = "Work Experience",
  experiences,
  className,
  onAdd,
  onEdit,
  onRemove,
}: ProfileExperiencesEditorProps) {
  return (
    <section className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Button type="button" variant="outline" onClick={onAdd}>
          Add experience
        </Button>
      </div>

      {(!experiences || experiences.length === 0) && (
        <p className="text-muted-foreground mt-3 text-sm">
          No experiences added.
        </p>
      )}

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
            <div className="bg-muted relative hidden h-px w-full md:col-span-4 md:block" />
            <div className="flex min-w-0 items-center gap-2 md:col-span-5">
              <div className="min-w-0">
                {exp.url ? (
                  <Link
                    href={exp.url}
                    className="block overflow-hidden text-[15px] font-medium text-ellipsis whitespace-nowrap hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={exp.title || undefined}
                  >
                    {exp.title}
                  </Link>
                ) : (
                  <span
                    className="block overflow-hidden text-[15px] font-medium text-ellipsis whitespace-nowrap"
                    title={exp.title || undefined}
                  >
                    {exp.title}
                  </span>
                )}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(idx)}
                >
                  <HiOutlinePencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(idx)}
                >
                  <HiOutlineTrash className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
