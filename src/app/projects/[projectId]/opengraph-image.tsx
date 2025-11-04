import { Generator } from "@/shared/components/seo/image-metadata/commons/generator/generator";
import { resolveOgImageSource } from "@/shared/components/seo/image-metadata/commons/utils/resolve-og-image";
import { ProjectImageMetadata } from "@/shared/components/seo/image-metadata/projects/project/project-image-metadata";

import { getProjectDetails } from "@/features/projects/services/project.service";

//export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "OpenSource Together project preview";

export default async function Image({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  try {
    const { projectId } = await params;

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const project = await getProjectDetails(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const safeLogo = await resolveOgImageSource(
      project.logoUrl,
      project.title || "Project"
    );

    return await Generator({
      children: (
        <ProjectImageMetadata
          name={project.title || "OpenSource Together"}
          description={project.description || ""}
          imageUrl={safeLogo}
          forksCount={project.repositoryDetails?.forksCount}
          openIssuesCount={project.repositoryDetails?.openIssuesCount}
          pullRequestsCount={project.repositoryDetails?.pullRequestsCount}
        />
      ),
    });
  } catch (error) {
    console.error("Failed to generate project metadata image:", error);

    try {
      return await Generator({
        children: (
          <ProjectImageMetadata
            name="OpenSource Together"
            description="Discover and contribute to open-source projects that make a difference."
          />
        ),
      });
    } catch (fallbackError) {
      console.error("Failed to generate fallback image:", fallbackError);
      throw new Error(
        `Failed to generate OpenGraph image: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
