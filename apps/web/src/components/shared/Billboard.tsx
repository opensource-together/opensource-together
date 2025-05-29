import Image from "next/image";
import FilterSearchBar from "../ui/filterSearchBar";

export default function Billboard() {
  return (
    <div className="relative h-[330px] w-[1108px] rounded-[30px] border border-black/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-geist flex items-center gap-1 font-normal text-[10px] text-center text-black/50"> <Image src="/icons/blue-point-new-icon.svg" alt="new-project" width={10} height={10} />10 Projets ajoutés cette semaine !</p>
        <p className="font-geist font-medium text-[44px] text-center text-black leading-none tracking-[-0.03em] mt-3">
          Grandir ensemble <br />grâce à l'open source
        </p>
        <p className="font-geist font-normal text-[12px] text-center text-black/50 mt-4 mb-6">
          Trouvez des projets, postulez à des rôles, collaborez — construisons, <br /> partageons et grandissons ensemble grâce à l'open source
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
