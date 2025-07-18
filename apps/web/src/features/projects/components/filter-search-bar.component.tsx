import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex h-[50px] w-[125px] cursor-pointer flex-col rounded-full px-4 py-[8px] transition-all duration-200 hover:bg-white">
      <span className="text-[11px] font-normal text-black/50 transition-colors duration-200 group-hover:text-black/70">
        {label}
      </span>
      <span className="text-xs font-medium tracking-tight transition-colors duration-200 group-hover:text-black">
        {value}
      </span>
    </div>
  );
}

export default function FilterSearchBar() {
  return (
    <div className="flex h-[50px] w-[649px] items-center justify-center">
      <div className="group flex h-full w-full items-center justify-between rounded-full border border-black/5 bg-white px-4 py-1 shadow-md shadow-black/3 backdrop-blur-lg transition-colors duration-200 hover:bg-black/5">
        <div className="absolute left-[-1px] flex items-center gap-4">
          <div className="flex items-center">
            <div className="relative">
              <FilterItem label="Filtrer par" value="Technologie" />
              <div className="absolute top-1/2 right-0 h-12 -translate-y-1/2" />
            </div>
            <div className="relative">
              <FilterItem label="Filtrer par" value="Role" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="relative">
              <FilterItem label="Filtrer par" value="Catégorie" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="">
              <FilterItem label="Trier par" value="Plus Récent" />
            </div>
          </div>
        </div>

        <Button className="absolute right-2 h-[35px] px-4">
          Chercher un Projet{" "}
          <Icon
            name="search"
            size="xs"
            variant="white"
            className="scale-x-[-1]"
          />
        </Button>
      </div>
    </div>
  );
}
