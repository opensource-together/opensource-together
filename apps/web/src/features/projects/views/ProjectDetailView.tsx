"use client";

import peopleicon from "@/shared/icons/people.svg";
import Header from "@/shared/layout/Header";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProjectFilters from "../components/ProjectFilters";
import ProjectPageCard from "../components/ProjectPageCard";
import ProjectSideBar from "../components/ProjectSideBar";
import RoleCard from "../components/RoleCard";
import SkeletonProjectDetail from "../components/SkeletonProjectDetail";
import { useProject } from "../hooks/useProjects";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const [simulateLoading, setSimulateLoading] = useState(true);
  // Tanstack Query useProject hook to fetch project details by project ID
  const { data: project, isLoading, isError, error } = useProject(projectId);

  // This simulates loading for skeleton loaders even when data is cached
  useEffect(() => {
    const timer = setTimeout(() => setSimulateLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Determine if we show loading state (either real API loading or simulated loading)
  const showLoading = isLoading || simulateLoading;

  // Handle error state
  if (isError && !showLoading) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Error", href: "#", isActive: true },
            ]}
          />
        </div>
        <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
          <div className="text-red-500 p-4 rounded-md bg-red-50">
            <h2 className="text-xl font-bold">Error loading project</h2>
            <p>
              There was an error loading the project details. Please try again
              later.
            </p>
            {process.env.NODE_ENV !== "production" &&
              error instanceof Error && (
                <p className="mt-2 text-sm font-mono">{error.message}</p>
              )}
          </div>
        </div>
      </>
    );
  }

  // Show skeleton loader while loading
  if (showLoading) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Loading...", href: "#", isActive: true },
            ]}
          />
        </div>
        <SkeletonProjectDetail />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: project?.title || "Project", href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-2 md:mt-4 gap-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
          <div className="lg:max-w-[721.96px] w-full">
            <ProjectPageCard
              title={project?.title}
              description={project?.description}
              longDescription={project?.longDescription}
              techStacks={project?.techStacks}
              keyBenefits={project?.keyBenefits}
            />
          </div>
          <ProjectSideBar
            socialLinks={project?.socialLinks}
            communityStats={{
              stars: project?.communityStats?.stars || 0,
              contributors: 0, // Changed from contributors to members
              forks: 0, // This will not be shown
            }}
            showForks={false}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3 lg:max-w-[721.96px]">
            <p className="text-[20px] font-medium font-geist flex items-centers gap-1">
              Open Roles{" "}
              <Image
                src={peopleicon}
                className="mt-1"
                alt="peopleicon"
                width={14}
                height={14}
              />{" "}
            </p>
            <ProjectFilters
              filters={[
                { label: "", value: "Plus Récent", isSortButton: true },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3 mt-6 mb-30">
            {project?.roles && project.roles.length > 0 ? (
              project.roles.map((role) => (
                <RoleCard
                  key={role.id}
                  title={role.title}
                  description={role.description}
                  badges={role.badges}
                  experienceBadge={role.experienceBadge}
                />
              ))
            ) : (
              // Default role cards if none are provided
              <>
                <RoleCard
                  title="Back-end Developer"
                  description="We're hiring a Backend Developer to build robust, scalable server-side systems and APIs. You'll collaborate with cross-functional teams to deliver reliable backend systems using technologies like [ Node.js, Python, SQL, etc.]."
                  badges={[
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                  ]}
                  experienceBadge="3+ Years Experience"
                />
                <RoleCard
                  title="UX Designer"
                  description="We're looking for a UX Designer to craft intuitive, user-centered experiences across web and mobile platforms.\nYou'll collaborate with product and dev teams to turn insights into wireframes, prototypes, and seamless user journeys."
                  badges={[
                    { label: "Design", color: "#FDA5D5", bgColor: "#FDF2F8" },
                  ]}
                  experienceBadge="2+ Years Experience"
                />
                <RoleCard
                  title="Front-end Developer"
                  description="We're looking for a Frontend Developer to build responsive, high-quality user interfaces using modern web technologies. You'll be responsible for turning design concepts into fast, accessible, and interactive digital experiences."
                  badges={[
                    { label: "React", color: "#00BCFF", bgColor: "#DFF2FE" },
                  ]}
                  experienceBadge="1+ Year Experience"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
