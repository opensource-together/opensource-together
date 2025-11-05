import { Metadata } from "next";

import { FRONTEND_URL } from "@/config/config";

import CTAFooter from "@/shared/components/layout/cta-footer";

import { getProjectDetails } from "@/features/projects/services/project.service";
import ProjectDetailView from "@/features/projects/views/project-detail.view";

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
        locale: "fr_FR",
        countryName: "France",
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
      title: "Project | OpenSource Together",
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
