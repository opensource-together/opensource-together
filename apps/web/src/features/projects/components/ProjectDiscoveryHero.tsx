import Image from "next/image";

import FilterSearchBar from "./FilterSearchBar";

export default function ProjectDiscoveryHero() {
  return (
    <div className="relative mx-auto rounded-4xl border border-black/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-1 text-center text-xs font-normal tracking-tight">
          {" "}
          <Image
            src="/icons/blue-point-new-icon.svg"
            alt="new-project"
            width={10}
            height={10}
          />
          10 Projets ajoutés cette semaine !
        </p>
        <p className="mt-3 text-center text-5xl leading-none font-medium tracking-tight">
          Grandir ensemble <br />
          grâce à l'open source
        </p>
        <p className="text-muted-foreground mt-4 mb-6 text-center text-sm">
          Trouvez des projets, postulez à des rôles, collaborez — construisons,{" "}
          <br /> partageons et grandissons ensemble grâce à l'open source
        </p>
        <FilterSearchBar />
      </div>
      <Image
        src="/background-homepage.png"
        alt="billboard"
        width={1108}
        height={330}
      />
    </div>
  );
}
