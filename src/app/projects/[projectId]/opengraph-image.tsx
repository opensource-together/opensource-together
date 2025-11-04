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
  // Log entry point for debugging
  console.log("[OG Image] Starting image generation");

  try {
    const { projectId } = await params;
    console.log("[OG Image] Project ID:", projectId);

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    console.log("[OG Image] Fetching project details...");
    const project = await getProjectDetails(projectId);
    console.log("[OG Image] Project fetched:", project?.title);

    if (!project) {
      throw new Error("Project not found");
    }

    console.log("[OG Image] Resolving logo...");
    const safeLogo = await resolveOgImageSource(
      project.logoUrl,
      project.title || "Project"
    );
    console.log("[OG Image] Logo resolved");

    console.log("[OG Image] Generating image response...");
    const imageResponse = await Generator({
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
    console.log("[OG Image] Image response generated successfully");
    return imageResponse;
  } catch (error) {
    console.error("[OG Image] Error in main try block:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
    });

    try {
      console.log("[OG Image] Attempting fallback image...");
      const fallbackResponse = await Generator({
        children: (
          <ProjectImageMetadata
            name="OpenSource Together"
            description="Discover and contribute to open-source projects that make a difference."
          />
        ),
      });
      console.log("[OG Image] Fallback image generated");
      return fallbackResponse;
    } catch (fallbackError) {
      console.error("[OG Image] Fallback image generation failed:", {
        error:
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined,
        name:
          fallbackError instanceof Error
            ? fallbackError.name
            : typeof fallbackError,
      });

      // Re-throw with more context for Cloudflare logs
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const fallbackErrorMessage =
        fallbackError instanceof Error
          ? fallbackError.message
          : String(fallbackError);

      throw new Error(
        `OpenGraph image generation failed. Original: ${errorMessage}. Fallback: ${fallbackErrorMessage}`
      );
    }
  }
}
