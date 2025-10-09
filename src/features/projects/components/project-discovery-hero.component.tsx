import Image from "next/image";

import HeroBadge from "@/shared/components/ui/hero-badge";

import FilterSearchBar from "./filter-search-bar.component";

export default function ProjectDiscoveryHero() {
  return (
    <div className="relative mx-auto w-full">
      <Image
        src="/illustrations/top.png"
        alt="Bible gauche"
        width={1441}
        height={400}
        className="absolute bottom-10 left-1/2 z-[-1] h-auto w-[100%] -translate-x-1/2 object-contain sm:bottom-0 sm:w-[95%] md:bottom-6 md:w-[100%] lg:bottom-3 lg:w-[105%]"
      />

      <div className="relative z-10 mx-auto mb-5 flex min-h-[260px] w-full max-w-[1441px] flex-col items-center justify-center md:min-h-[320px] lg:min-h-[400px]">
        <HeroBadge className="mb-3" />
        <h1
          className="mt-3 text-center text-3xl leading-none md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Together, build our <br />
          future in open source
        </h1>
        <p className="mt-5 max-w-[450px] text-center text-xs text-[#404040] md:text-sm">
          Empowering open source initiatives through effortless project
          discovery, collaboration, and contributor connection.
        </p>
        <div className="mt-8 hidden md:block">
          <FilterSearchBar />
        </div>
      </div>
    </div>
  );
}
