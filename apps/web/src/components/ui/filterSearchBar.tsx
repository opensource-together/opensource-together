import { Button } from "./button";
import Image from "next/image";

export default function FilterSearchBar() {
  return (
    <div className="flex items-center bg-white justify-between w-[653px] h-[50px] p-2 rounded-full border border-black/5 shadow-md shadow-black/5 backdrop-blur-sm">
      <div className="flex items-center gap-6">
      <Image src="/icons/search-icon-filter.svg" alt="filter-search-bar" width={25} height={25} />
        <div className="flex flex-col border-r border-black/5 pr-12">
        <span className="font-geist font-normal text-[10px] text-black/50 tracking-[-0.05em]">Filtrer par</span>
          <span className="font-geist font-medium text-[12px] text-black tracking-[-0.05em]">Technologie</span>
        </div>
        <div className="flex flex-col border-r border-black/5 pr-12">
        <span className="font-geist font-normal text-[10px] text-black/50 tracking-[-0.05em]">Filtrer par</span>
          <span className="font-geist font-medium text-[12px] text-black tracking-[-0.05em]">Role</span>
        </div>
        <div className="flex flex-col border-r border-black/5 pr-12">
        <span className="font-geist font-normal text-[10px] text-black/50 tracking-[-0.05em]">Filtrer par</span>
          <span className="font-geist font-medium text-[12px] text-black tracking-[-0.05em]">Difficulté</span>
          
        </div>
        <div className="flex flex-col">
        <span className="font-geist font-normal text-[10px] text-black/50 tracking-[-0.05em]">Trier par</span>
          <span className="font-geist font-medium text-[12px] text-black tracking-[-0.05em]">Plus récent</span>
        </div>
      </div>
      <Button className="flex items-center justify-center bg-black text-white font-geist font-medium text-[13px] tracking-[-0.05em]">
        Chercher un Projet
      </Button>
    </div>
  );
} 