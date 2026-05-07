import Image from "next/image";

import { FadeIn } from "@/shared/components/motion/fade-in";

import type { ProjectFilters } from "../types/project-filters.type";
import { DiscoveryHeroIntro } from "./discovery-hero-intro.component";

interface ProjectDiscoveryHeroProps {
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
  initialFilters?: ProjectFilters;
}

export default function ProjectDiscoveryHero({
  onFilterChange,
  isLoading,
  initialFilters,
}: ProjectDiscoveryHeroProps) {
  return (
    <div className="relative mx-auto w-full">
      <FadeIn delay={0.1}>
        {/* Desktop / Tablet image */}
        <Image
          src="/illustrations/traveler.png"
          alt="Bible gauche"
          width={2882}
          height={800}
          quality={100}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 0px, (max-width: 1441px) 100vw, 1441px"
          className="absolute bottom-6 left-1/2 z-[-1] hidden h-auto w-full max-w-[1441px] -translate-x-1/2 object-contain md:block lg:bottom-3"
        />
        {/* Mobile image (no props change, same src, tailored sizing) */}
        <Image
          src="/illustrations/traveler-mobile.png"
          alt="Bible gauche"
          width={402}
          height={361}
          quality={100}
          className="absolute bottom-10 left-1/2 z-[-1] h-auto w-[115%] -translate-x-1/2 object-contain sm:bottom-8 md:hidden"
        />
      </FadeIn>

      <div className="relative z-10 mx-auto mt-11 mb-5 flex min-h-[260px] w-full max-w-[1441px] flex-col items-center justify-center md:-mt-5 md:min-h-[320px] lg:min-h-[400px]">
        <DiscoveryHeroIntro
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          initialFilters={initialFilters}
        />
      </div>
    </div>
  );
}
