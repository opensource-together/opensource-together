import { readFileSync } from "node:fs";
import path from "node:path";

import { getProjectDetails } from "@/features/projects/services/project.service";
import { Generator } from "@/shared/components/seo/image-metadata/commons/generator/generator";
import { ProjectImageMetadata } from "@/shared/components/seo/image-metadata/projects/project/project-image-metadata";

function readProjectOgBackdropDataUrl(): string | undefined {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/illustrations/ost-preview.png"
    );
    return `data:image/png;base64,${readFileSync(filePath).toString("base64")}`;
  } catch {
    return undefined;
  }
}

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
  const backdropImageSrc = readProjectOgBackdropDataUrl();

  try {
    const { projectId } = await params;

    const project = await getProjectDetails(projectId);

    const imageResponse = await Generator({
      children: (
        <ProjectImageMetadata
          name={project.title}
          description={project.description}
          imageUrl={project.logoUrl}
          backdropImageSrc={backdropImageSrc}
          starsCount={project.repositoryDetails?.stars}
          forksCount={project.repositoryDetails?.forksCount}
          openIssuesCount={project.repositoryDetails?.openIssuesCount}
          pullRequestsCount={project.repositoryDetails?.pullRequestsCount}
        />
      ),
    });
    return imageResponse;
  } catch (error) {
    console.error("Failed to generate project metadata image:", error);

    return Generator({
      children: (
        <ProjectImageMetadata
          name="OpenSource Together"
          description="Discover and contribute to open-source projects that make a difference."
          backdropImageSrc={backdropImageSrc}
        />
      ),
    });
  }
}
