"use client";

import React, { useEffect, useState } from "react";
import Header from "@/shared/layout/Header";
import ProjectPageCard from "../components/ProjectPageCard";
import ProjectSideBar from "../components/ProjectSideBar";
import ProjectFilters from "../components/ProjectFilters";
import RoleCard from '../components/RoleCard';
import { useProject } from "../hooks/useProjects";
import SkeletonProjectDetail from "../components/SkeletonProjectDetail";

interface ProjectDetailViewProps {
  slug: string;
}

export default function ProjectDetailView({ slug }: ProjectDetailViewProps) {
  const [simulateLoading, setSimulateLoading] = useState(true);
  const { 
    data: project, 
    isLoading, 
    isError, 
    error 
  } = useProject(slug);

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
        <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
          <div className="text-red-500 p-4 rounded-md bg-red-50">
            <h2 className="text-xl font-bold">Error loading project</h2>
            <p>There was an error loading the project details. Please try again later.</p>
            {process.env.NODE_ENV !== 'production' && error instanceof Error && (
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
        <SkeletonProjectDetail />
      </>
    );
  }

  return (
    <>
      <Header />  
      <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
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
              forks: 0 // This will not be shown
            }}
            showForks={false}
          />
        </div>
        <div>
          <p className="text-[20px] mb-3 font-medium font-geist">Open Roles</p>
          <ProjectFilters
            filters={[
              { label: '', value: 'Plus Récent', isSortButton: true },
            ]}
          />
          <div className="flex flex-col gap-3 mt-6 mb-30">
            {project?.roles && project.roles.length > 0 ? (
              project.roles.map((role) => (
                <RoleCard
                  key={role.id}
                  title={role.title}
                  description={role.description}
                  badges={role.badges}
                />
              ))
            ) : (
              // Default role cards if none are provided
              <>
                <RoleCard
                  title="Back-end Developer"
                  description="We're hiring a Backend Developer to build robust, scalable server-side systems and APIs. You'll collaborate with cross-functional teams to deliver reliable backend systems using technologies like [ Node.js, Python, SQL, etc.]."
                  badges={[{ label: 'MongoDB', color: '#00D5BE', bgColor: '#CBFBF1' }]}
                />
                <RoleCard
                  title="UX Designer"
                  description="We're looking for a UX Designer to craft intuitive, user-centered experiences across web and mobile platforms.\nYou'll collaborate with product and dev teams to turn insights into wireframes, prototypes, and seamless user journeys."
                  badges={[{ label: 'Design', color: '#FDA5D5', bgColor: '#FDF2F8' }]}
                />
                <RoleCard
                  title="Front-end Developer"
                  description="We're looking for a Frontend Developer to build responsive, high-quality user interfaces using modern web technologies.\nYou'll be responsible for turning design concepts into fast, accessible, and interactive digital experiences."
                  badges={[{ label: 'React', color: '#00BCFF', bgColor: '#DFF2FE' }]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
