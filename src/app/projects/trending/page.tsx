import { Metadata } from "next";

import CTAFooter from "@/shared/components/layout/cta-footer";

import ProjectTrendingView from "@/features/projects/views/project-trending.view";

export const metadata: Metadata = {
  title: "Trending Projects | OpenSource Together",
  description: "Trending Projects on OpenSource Together",
};

export default function ProjectTrendingPage() {
  return (
    <>
      <ProjectTrendingView />
      <CTAFooter imageIllustration="/illustrations/knight.png" />
    </>
  );
}
