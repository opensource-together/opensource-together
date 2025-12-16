import { useRouter } from "next/navigation";
import {
  HiMiniEllipsisVertical,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniPencilSquare,
  HiMiniTrash,
} from "react-icons/hi2";
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
        <Button variant="outline" size="icon" className="hover:bg-muted">
          <HiMiniEllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePublish();
          }}
          className="flex cursor-pointer items-center justify-between"
          disabled={isCurrentlyToggling}
        >
          <span>{project.published ? "Unpublish" : "Publish"}</span>
          {project.published ? (
            <HiMiniEyeSlash className="size-4" />
          ) : (
            <HiMiniEye className="size-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="flex cursor-pointer items-center justify-between"
        >
          <span>Edit Project</span>
          <HiMiniPencilSquare className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex cursor-pointer items-center justify-between text-destructive focus:text-destructive"
        >
          <span>Delete Project</span>
          <HiMiniTrash className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
