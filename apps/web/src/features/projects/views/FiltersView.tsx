import React from 'react';
import ProjectSearchBar from '@/features/projects/components/ProjectSearchBar';
import ProjectFilters from '@/features/projects/components/ProjectFilters';

export default function FiltersView() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
      <ProjectFilters />
      <ProjectSearchBar />
    </div>
  );
}