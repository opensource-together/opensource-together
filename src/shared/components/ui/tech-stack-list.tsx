"use client";

import StackLogo from "@/shared/components/ui/stack-logo";

type Tech = {
  id?: string;
  name: string;
  iconUrl?: string | null;
};

interface TechStackListProps {
  title?: string;
  techs: Tech[];
  emptyText?: string;
  className?: string;
}

export function TechStackList({
  title,
  techs,
  emptyText,
  className,
}: TechStackListProps) {
  return (
    <div className={className}>
      {title && <h2 className="mb-3 text-sm">{title}</h2>}
      {techs?.length ? (
        <div className="flex w-full flex-wrap gap-2.5 gap-y-2">
          {techs.map((tech, index) => (
            <StackLogo
              key={tech.id || `${tech.name}-${index}`}
              name={tech.name}
              icon={tech.iconUrl || "/icons/empty-project.svg"}
              alt={tech.name}
            />
          ))}
        </div>
      ) : emptyText ? (
        <p className="text-black/50 text-sm">{emptyText}</p>
      ) : null}
    </div>
  );
}
