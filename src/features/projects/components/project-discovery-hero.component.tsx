import Image from "next/image";

import { FadeIn } from "@/shared/components/motion/fade-in";
import { FadeUp } from "@/shared/components/motion/fade-up";
import HeroBadge from "@/shared/components/ui/hero-badge";

import FilterSearchBar from "./filter-search-bar.component";

interface ProjectDiscoveryHeroProps {
  onFilterChange?: (filters: {
    techStacks: string[];
    categories: string[];
    orderBy: "createdAt" | "title";
    orderDirection: "asc" | "desc";
  }) => void;
  isLoading?: boolean;
}

export default function ProjectDiscoveryHero({
  onFilterChange,
  isLoading,
}: ProjectDiscoveryHeroProps) {
  return (
    <div className="relative mx-auto w-full">
      <FadeIn delay={0.1}>
        <Image
          src="/illustrations/traveler.png"
          alt="Bible gauche"
          width={1441}
          height={400}
          className="absolute bottom-10 left-1/2 z-[-1] h-auto w-[100%] -translate-x-1/2 object-contain sm:bottom-0 sm:w-[95%] md:bottom-6 md:w-[100%] lg:bottom-3 lg:w-[105%]"
        />
      </FadeIn>

      <div className="relative z-10 mx-auto mb-5 flex min-h-[260px] w-full max-w-[1441px] flex-col items-center justify-center md:min-h-[320px] lg:min-h-[400px]">
        <FadeUp delay={0.05}>
          <HeroBadge className="mb-3" />
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1
            className="mt-3 text-center text-3xl leading-none md:text-5xl"
            style={{ fontFamily: "Aspekta", fontWeight: 500 }}
          >
            Together, build our <br />
            future in open source
          </h1>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="mt-5 max-w-[450px] text-center text-xs text-neutral-950 md:text-sm">
            Empowering open source initiatives through effortless project
            discovery, collaboration, and contributor connection.
          </p>
        </FadeUp>

        <div className="mt-8 hidden md:block">
          <FilterSearchBar
            onFilterChange={onFilterChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
