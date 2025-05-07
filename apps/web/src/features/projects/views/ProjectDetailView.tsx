"use client";

import React, { useEffect, useState } from "react";
import Header from "@/shared/layout/Header";
import ProjectPageCard, { SkeletonProjectPageCard } from "../components/ProjectPageCard";
import ProjectSideBar, { SkeletonProjectSideBar } from "../components/ProjectSideBar";
import ProjectFilters, { SkeletonProjectFilters } from "../components/ProjectFilters";
import RoleCard, { SkeletonRoleCard } from '../components/RoleCard';

export default function MyProjectPageView() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement de 1 seconde
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <Header />  
    <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
        <div className="lg:max-w-[721.96px] w-full">
          {isLoading ? <SkeletonProjectPageCard /> : <ProjectPageCard />}
        </div>
        {isLoading ? <SkeletonProjectSideBar /> : <ProjectSideBar />}
      </div>
      <div>
        <p className="text-[20px] mb-3 font-medium font-geist">Open Roles</p>
        {isLoading ? <SkeletonProjectFilters count={1} /> : (
          <ProjectFilters
            filters={[
              { label: '', value: 'Plus Récent', isSortButton: true },
            ]}
          />
        )}
        <div className="flex flex-col gap-3 mt-6 mb-30">
          {isLoading ? (
            <>
              <SkeletonRoleCard />
              <SkeletonRoleCard />
              <SkeletonRoleCard />
            </>
          ) : (
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
