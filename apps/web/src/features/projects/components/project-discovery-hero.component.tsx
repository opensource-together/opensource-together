import Image from "next/image";

import FilterSearchBar from "./filter-search-bar.component";

export default function ProjectDiscoveryHero() {
  return (
    <div className="relative mx-auto mb-5">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted-foreground mt-6 flex items-center gap-1 text-center text-xs font-normal tracking-tight md:mt-15">
          <Image
            src="/icons/blue-point-new-icon.svg"
            alt="new-project"
            width={10}
            height={10}
          />
          10 Projets ajoutés cette semaine !
        </span>
        <h1
          className="mt-3 text-center text-3xl leading-none tracking-tighter md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Construisez votre futur <br />
          dans l'open source
        </h1>
        <p className="text-muted-foreground mx-7 mt-4 mb-6 max-w-[450px] text-center text-xs md:text-sm">
          Trouvez des projets, postulez à des rôles, collaborez, <br />
          partageons et grandissons ensemble grâce à l&apos;open source
        </p>
        <div className="hidden md:block">
          <FilterSearchBar />
        </div>
      </div>
      <Image
        src="/background-homepage.png"
        alt="background-homepage"
        width={1094}
        height={266}
        className="h-[200px] w-full md:h-[300px]"
      />
    </div>
  );
}
