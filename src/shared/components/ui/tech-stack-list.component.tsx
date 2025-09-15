import StackLogo from "@/shared/components/logos/stack-logo";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

interface TechStackListProps {
  techStackIds: string[];
  className?: string;
}

export function TechStackList({ techStackIds, className }: TechStackListProps) {
  const { getTechStacksByIds } = useTechStack();
  const techStacks = getTechStacksByIds(techStackIds);

  if (techStacks.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {techStacks.map((tech) => (
        <StackLogo
          key={tech.id}
          name={tech.name}
          icon={tech.iconUrl}
          alt={tech.name}
        />
      ))}
    </div>
  );
}
