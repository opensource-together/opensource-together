import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { RiDraggable } from "react-icons/ri";

import { Button } from "@/shared/components/ui/button";
import { DraggableList } from "@/shared/components/ui/draggable-list";
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
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

function formatRange(exp: ExperienceItem): string {
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return "Current";
    const date = new Date(`${dateStr}T00:00:00`);
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
  onReorder,
}: ProfileExperiencesEditorProps) {
  const canReorder = experiences.length > 1 && !!onReorder;

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Button type="button" variant="outline" onClick={onAdd}>
          Add experience
        </Button>
      </div>

      {(!experiences || experiences.length === 0) && (
        <p className="mt-3 text-muted-foreground text-sm">
          No experiences added.
        </p>
      )}

      <DraggableList
        items={experiences}
        onReorder={onReorder}
        keyExtractor={(exp, idx) => `${exp.title}-${idx}`}
        enabled={canReorder}
        className="flex w-full flex-col"
        itemClassName={() =>
          "mt-4 grid grid-cols-1 items-center gap-4 py-1 md:grid-cols-12"
        }
        renderDragHandle={() => null}
        renderItem={(exp, idx) => (
          <>
            {canReorder && (
              <div className="hidden items-center md:col-span-1 md:flex">
                <button
                  type="button"
                  className="flex h-6 w-6 cursor-grab items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <RiDraggable className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="text-muted-foreground md:col-span-3">
              <span className="whitespace-nowrap text-[15px]">
                {formatRange(exp)}
              </span>
            </div>
            <div className="relative hidden h-px w-full bg-muted md:col-span-4 md:block" />
            <div
              className={cn(
                "flex min-w-0 items-center gap-2",
                canReorder ? "md:col-span-4" : "md:col-span-5"
              )}
            >
              {canReorder && (
                <button
                  type="button"
                  className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing md:hidden"
                  aria-label="Drag to reorder"
                >
                  <RiDraggable className="h-4 w-4" />
                </button>
              )}
              <div className="min-w-0">
                {exp.url ? (
                  <Link
                    href={exp.url}
                    className="block overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[15px] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={exp.title || undefined}
                  >
                    {exp.title}
                  </Link>
                ) : (
                  <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[15px]"
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
                  <HiMiniPencilSquare className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(idx)}
                >
                  <HiOutlineTrash className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </section>
  );
}
