import { useRouter } from "next/navigation";
import {
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMoreFill,
  RiPencilLine,
} from "react-icons/ri";
import type { Project } from "@/features/projects/types/project.type";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface ProjectTableActionsProps {
  project: Project;
  onTogglePublish: (project: Project) => void;
  onDelete: (project: { id: string; title: string }) => void;
  isTogglingPublished: boolean;
  togglingProjectId: string | null;
}

export function ProjectTableActions({
  project,
  onTogglePublish,
  onDelete,
  isTogglingPublished,
  togglingProjectId,
}: ProjectTableActionsProps) {
  const router = useRouter();

  const handleTogglePublish = () => {
    onTogglePublish(project);
  };

  const handleEdit = () => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleDelete = () => {
    onDelete({
      id: project.id ?? "",
      title: project.title || "Untitled Project",
    });
  };

  const isCurrentlyToggling =
    isTogglingPublished && togglingProjectId === project.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-[30px] border-[0.5px] p-1.5 hover:bg-muted"
        >
          <RiMoreFill className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePublish();
          }}
          disabled={isCurrentlyToggling}
        >
          {project.published ? (
            <RiEyeOffLine className="size-4 text-primary" />
          ) : (
            <RiEyeLine className="size-4 text-primary" />
          )}
          {project.published ? "Unpublish" : "Publish"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          <RiPencilLine className="size-4 text-primary" />
          Edit Project
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <RiDeleteBinLine className="size-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
