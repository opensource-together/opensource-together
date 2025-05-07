import React from 'react';
import Image from 'next/image';
import chevronDown from '@/shared/icons/chevron-down.svg';

interface FilterButtonProps {
  label: string;
  value: string;
  hasChevron?: boolean;
  isSortButton?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, value, hasChevron = true, isSortButton = false }) => {
  return (
    <button className="h-[35px] px-3 flex items-center gap-1 font-geist font-semibold text-[13px] border border-[black]/5 rounded-[5px] bg-white hover:bg-[#F9F9F9] transition-colors whitespace-nowrap">
      {isSortButton && <span className="font-light text-[black]/50 hidden sm:inline">Sort by: </span>}
      {label && !isSortButton && <span className="font-light text-[black] hidden sm:inline">{label}: </span>}
      <span className='font-light'>{value}</span>
      {hasChevron && (
        <Image src={chevronDown} alt="Expand" width={10} height={6} />
      )}
    </button>
  );
};

interface ProjectFiltersProps {
  filters: FilterButtonProps[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ filters }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2">
      {filters.map((filter, idx) => (
        <FilterButton key={idx} {...filter} />
      ))}
    </div>
  );
};

export default ProjectFilters;

export function SkeletonProjectFilters({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-[35px] w-[110px] bg-gray-200 rounded-[5px]" />
      ))}
    </div>
  );
} 