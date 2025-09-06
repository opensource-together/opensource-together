import Image from "next/image";

import FilterSearchBar from "./filter-search-bar.component";

export default function ProjectDiscoveryHero() {
  return (
    <div className="relative mx-5 min-h-[266px] w-full max-w-[3000px] overflow-hidden">
      <Image
        src="/illustrations/bible-left-2.png"
        alt="Bible gauche"
        width={758}
        height={533}
        className="pointer-events-none absolute top-[-150px] left-[-165px] z-0 hidden md:block"
      />
      <Image
        src="/illustrations/bible-right-2.png"
        alt="Bible droite"
        width={705}
        height={840}
        className="pointer-events-none absolute top-[-150px] right-[-165px] z-0 hidden md:block"
        style={{ transform: "rotate(8deg)" }}
      />

      <Image
        src="/illustrations/bible-left-2.png"
        alt="Bible gauche"
        width={400}
        height={200}
        className="pointer-events-none absolute top-[-50px] left-[-100px] z-0 md:hidden"
      />
      <Image
        src="/illustrations/bible-right-2.png"
        alt="Bible droite"
        width={400}
        height={200}
        className="pointer-events-none absolute top-[-50px] right-[-100px] z-0 md:hidden"
        style={{ transform: "rotate(8deg)" }}
      />

      <div className="relative z-10 mx-auto mb-5 flex min-h-[266px] w-full max-w-[1094px] flex-col items-center justify-center">
        <h1
          className="mt-3 text-center text-3xl leading-none md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Construisez votre futur <br />
          dans l'open source
        </h1>
        <p className="text-muted-foreground mt-4.5 max-w-[450px] text-center text-xs md:text-sm">
          Trouvez des projets, postulez à des rôles, collaborez, <br />
          partageons et grandissons ensemble grâce à l&apos;open source
        </p>

        <span className="text-muted-foreground mt-4.5 mb-7 flex h-[40px] w-[260px] items-center justify-center gap-1 rounded-full bg-[#FAFAF9] text-center text-xs font-normal tracking-tight">
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
