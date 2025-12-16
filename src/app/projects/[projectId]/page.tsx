import type { Metadata } from "next";

import { FRONTEND_URL } from "@/config/config";
import { getProjectDetails } from "@/features/projects/services/project.service";
import ProjectDetailView from "@/features/projects/views/project-detail.view";
import CTAFooter from "@/shared/components/layout/cta-footer";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const project = await getProjectDetails(projectId);

    const projectUrl = `${FRONTEND_URL.replace(/\/$/, "")}/projects/${projectId}`;

    return {
      title: `${project.title}`,
      description: project.description,
      alternates: { canonical: projectUrl },
      openGraph: {
        title: `${project.title}`,
        description: project.description,
        images: [
          {
            url: `${projectUrl}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${project.title} project preview`,
          },
        ],
        url: projectUrl,
        type: "website",
        siteName: "OpenSource Together",
        locale: "en_US",
        emails: ["contact@opensourcetogether.com"],
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title}`,
        description: project.description,
        images: [`${projectUrl}/opengraph-image`],
      },
    };
  } catch (error) {
    console.error("generateMetadata project fetch failed:", error);
    return {
      title: "Project",
      description: "Discover open source projects on OpenSource Together.",
    };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <ProjectDetailView projectId={projectId} />
      <CTAFooter
        imageIllustration="/illustrations/winged-angel.png"
        imageIllustrationMobile="/illustrations/winged-angel-mobile.png"
      />
    </>
  );
}
