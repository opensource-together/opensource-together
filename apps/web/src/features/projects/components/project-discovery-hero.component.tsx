import Image from "next/image";

import FilterSearchBar from "./filter-search-bar.component";

export default function ProjectDiscoveryHero() {
  return (
    <div className="relative mx-auto w-full">
      <Image
        src="/illustrations/bible.png"
        alt="Bible gauche"
        width={1200}
        height={1000}
        className="absolute bottom-52 z-0 object-contain sm:bottom-5 sm:h-full sm:w-full"
      />

      <div className="relative z-10 mx-auto mb-5 flex min-h-[266px] w-full max-w-[1094px] flex-col items-center justify-center">
        <h1
          className="mt-3 text-center text-3xl leading-none md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Construisez votre futur <br />
          dans l'open source
        </h1>
        <p className="text-muted-foreground mt-6 max-w-[450px] text-center text-xs md:text-sm">
          Trouvez des projets, postulez à des rôles, collaborez, <br />
          partageons et grandissons ensemble grâce à l&apos;open source
        </p>

        <span className="text-muted-foreground mt-6 mb-10 flex h-[40px] w-[260px] items-center justify-center gap-1 rounded-full bg-[#FAFAF9] text-center text-xs font-normal tracking-tight md:mt-5">
          <Image
            src="/project-icons-example.svg"
            alt="project-icons-example"
            width={66}
            height={20}
          />
          Rejoignez plus de 5k projets !
        </span>
        <div className="hidden md:block">
          <FilterSearchBar />
        </div>
      </div>
    </div>
  );
}
