"use client";

import Header from "@/shared/layout/Header";
import ProjectPageCard from "../components/ProjectPageCard";
import ProjectSideBar from "../components/ProjectSideBar";
import ProjectFilters from "../components/ProjectFilters";

export default function MyProjectPageView() {
  return (
    <>
    <Header />  
    <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
        <div className="lg:max-w-[721.96px] w-full">
          <ProjectPageCard />
        </div>
        <ProjectSideBar />
      </div>
      <div>
        <p className="text-[20px] mb-3 font-medium font-geist">Open Roles</p>
      <ProjectFilters
        filters={[
          { label: '', value: 'Plus Récent', isSortButton: true },
        ]}
      />
      </div>
    </div>
    </>
  );
}
