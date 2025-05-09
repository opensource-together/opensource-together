import React from 'react';
import { SkeletonProjectPageCard } from './ProjectPageCard';
import { SkeletonProjectSideBar } from './ProjectSideBar';
import { SkeletonProjectFilters } from './ProjectFilters';
import { SkeletonRoleCard } from './RoleCard';

export default function SkeletonProjectDetail() {
  return (
    <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
        <div className="lg:max-w-[721.96px] w-full">
          <SkeletonProjectPageCard />
        </div>
        <SkeletonProjectSideBar />
      </div>
      <div>
        <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
        <SkeletonProjectFilters count={1} />
        <div className="flex flex-col gap-3 mt-6 mb-30">
          <SkeletonRoleCard />
          <SkeletonRoleCard />
          <SkeletonRoleCard />
        </div>
      </div>
    </div>
  );
} 