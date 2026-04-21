import { useRouter } from "next/navigation";
import type { Project } from "@/features/projects/types/project.type";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";
import { cn } from "@/shared/lib/utils";
import { formatNumberShort } from "@/shared/lib/utils/format-number";

import { ProjectTableActions } from "./project-table-actions.component";

export default function MyProjectRow({
  project,
  onTogglePublish,
  onDelete,
  isTogglingPublished,
  togglingProjectId,
}: {
  project: Project;
  onTogglePublish: (project: Project) => void;
  onDelete: (project: { id: string; title: string }) => void;
  isTogglingPublished: boolean;
  togglingProjectId: string | null;
}) {
  const router = useRouter();
  const { data: repoSummary, isLoading: isRepoLoading } =
    useProjectRepositorySummary(project.publicId || project.id);

  const openIssues =
    repoSummary?.openIssuesCount ??
    project.repositoryDetails?.openIssuesCount ??
    0;

  const cellSurface =
    "group-hover:bg-muted/30 transition-[background-color,border-radius] duration-200";

  return (
    <TableRow
      key={project.id}
      className="group border-0 hover:bg-transparent"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <TableCell className={cn(cellSurface, "group-hover:rounded-l-xl")}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            src={project.logoUrl}
            name={project.title}
            alt={project.title}
            size="md"
            shape="soft"
          />
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-2">
              <h4 className="max-w-[60vw] truncate font-medium text-base md:max-w-[14rem]">
                {project.title}
              </h4>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className={cellSurface}>
        <div className="flex items-center gap-1.5">
          <span className="flex size-1.5 rounded-full bg-ost-blue-three"></span>
          <h2 className="inline-flex items-center gap-1 whitespace-nowrap text-muted-foreground text-sm">
            <span className="font-medium text-primary">
              {isRepoLoading ? (
                <Skeleton className="h-4 w-8" />
              ) : (
                formatNumberShort(openIssues)
              )}
            </span>{" "}
            {openIssues === 1 ? "Open Issue" : "Open Issues"}
          </h2>
        </div>
      </TableCell>

      <TableCell className={cellSurface}>
        <Badge
          variant={project.published ? "info" : "white"}
          className={
            project.published
              ? undefined
              : "border-[0.5px] border-muted-black-stroke"
          }
        >
          {project.published ? "Published" : "Not Published"}
        </Badge>
      </TableCell>

      <TableCell className={cellSurface}>
        <span className="font-medium text-sm">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </TableCell>

      <TableCell className={cn(cellSurface, "group-hover:rounded-r-xl")}>
        <ProjectTableActions
          project={project}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
          isTogglingPublished={isTogglingPublished}
          togglingProjectId={togglingProjectId}
        />
      </TableCell>
    </TableRow>
  );
}
