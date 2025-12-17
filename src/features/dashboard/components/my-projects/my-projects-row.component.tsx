import { useRouter } from "next/navigation";
import type { Project } from "@/features/projects/types/project.type";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";
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

  return (
    <TableRow
      key={project.id}
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <TableCell>
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
              <h4 className="max-w-[60vw] truncate font-medium md:max-w-[14rem]">
                {project.title}
              </h4>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
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
            {openIssues > 1 ? "Open Issues" : "Open Issue"}
          </h2>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={project.published ? "info" : "gray"}>
          {project.published ? "Published" : "Unpublished"}
        </Badge>
      </TableCell>

      <TableCell>
        <span className="font-medium text-sm">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </TableCell>

      <TableCell>
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
