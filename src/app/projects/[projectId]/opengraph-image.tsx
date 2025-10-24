import { Generator } from "@/shared/components/seo/image-metadata/commons/generator/generator";
import { resolveOgImageSource } from "@/shared/components/seo/image-metadata/commons/utils/resolve-og-image";
import { ProjectImageMetadata } from "@/shared/components/seo/image-metadata/projects/project/project-image-metadata";

import { getProjectDetails } from "@/features/projects/services/project.service";
import { Project } from "@/features/projects/types/project.type";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "OpenSource Together project preview";

export default async function Image({
  params,
}: {
  params: { projectId: string };
}) {
  try {
    const project = (await getProjectDetails(params.projectId)) as Project;

    const safeLogo = await resolveOgImageSource(project.logoUrl, project.title);

    return Generator({
      children: (
        <ProjectImageMetadata
          name={project.title}
          description={project.description}
          imageUrl={safeLogo}
          forksCount={project.repositoryDetails?.forksCount}
          openIssuesCount={project.repositoryDetails?.openIssuesCount}
          pullRequestsCount={project.repositoryDetails?.pullRequestsCount}
        />
      ),
    });
  } catch (error) {
    console.error("Failed to generate project metadata image:", error);

    return Generator({
      children: (
        <ProjectImageMetadata
          name="OpenSource Together"
          description="Discover and contribute to open-source projects that make a difference."
        />
      ),
    });
  }
}
