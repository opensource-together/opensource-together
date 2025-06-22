import Image from "next/image";
import React from "react";

import { Skeleton } from "@/shared/components/ui/skeleton";

interface FilterButtonProps {
  label: string;
  value: string;
  hasChevron?: boolean;
  isSortButton?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  value,
  hasChevron = true,
  isSortButton = false,
}) => {
  return (
    <button className="flex h-[35px] cursor-pointer items-center gap-1 rounded-full border border-[black]/5 bg-white px-3 text-[13px] font-semibold whitespace-nowrap transition-colors hover:bg-[#F9F9F9]">
      {isSortButton && (
        <span className="hidden font-light text-[black]/50 sm:inline">
          Trier par:{" "}
        </span>
      )}
      {label && !isSortButton && (
        <span className="hidden font-light text-[black] sm:inline">
          {label}{" "}
        </span>
      )}
      <span className="font-light">{value}</span>
      {hasChevron && (
        <Image
          src="/icons/chevron-down.svg"
          alt="Expand"
          width={10}
          height={6}
        />
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
    <div className="flex flex-wrap items-center gap-2 sm:gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[35px] w-[110px] rounded-[5px]" />
      ))}
    </div>
  );
}
