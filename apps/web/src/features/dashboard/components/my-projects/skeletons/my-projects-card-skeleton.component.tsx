import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardInfo,
  ProjectCardLeftGroup,
} from "@/shared/components/ui/project-card";

export default function MyProjectsCardSkeleton() {
  return (
    <div className="block">
      <ProjectCard>
        <ProjectCardHeader>
          <ProjectCardLeftGroup>
            {/* Avatar skeleton */}
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
            <ProjectCardInfo>
              {/* Title skeleton */}
              <div className="mb-1 h-5 w-32 animate-pulse rounded bg-gray-200" />
              {/* Owner skeleton */}
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
        </ProjectCardHeader>
        <ProjectCardContent>
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
          <ProjectCardDivider />
          {/* Tech stacks skeleton */}
          <ProjectCardFooter>
            <div className="flex gap-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-5 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </ProjectCardFooter>
        </ProjectCardContent>
      </ProjectCard>
    </div>
  );
}
