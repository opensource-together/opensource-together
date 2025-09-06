import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex h-12 w-36 cursor-pointer flex-col rounded-full px-8 py-2 transition-all duration-200 hover:rounded-full hover:bg-white">
      <span className="text-xs font-normal text-black/40 transition-colors duration-200">
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
    <div className="flex h-12.5 w-[729px] items-center justify-center">
      <div className="relative flex h-full w-full items-center rounded-full border border-black/5 bg-white shadow-md shadow-black/3 backdrop-blur-lg hover:rounded-full">
        <div className="flex h-full w-full items-center rounded-full transition-colors duration-200 hover:rounded-full hover:border-black/5 hover:bg-black/5">
          <div className="flex items-center">
            <div className="relative">
              <FilterItem label="Filtrer par" value="Technologie" />
              <div className="absolute top-1/2 right-0 h-12 -translate-y-1/2 pl-4" />
            </div>
            <div className="relative">
              <FilterItem label="Filtrer par" value="Rôle" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="relative">
              <FilterItem label="Filtrer par" value="Catégorie" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="relative">
              <div className="group flex h-12 w-[134px] cursor-pointer flex-col rounded-full px-4 py-2 transition-all duration-200 hover:rounded-full hover:bg-white">
                <span className="text-xs font-normal text-black/40 transition-colors duration-200 hover:rounded-full">
                  Trier par
                </span>
                <span className="text-xs font-medium tracking-tight transition-colors duration-200 group-hover:text-black">
                  Plus Récent
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button className="pointer-events-auto absolute right-2 h-8.5 px-4 text-xs">
          Chercher un Projet <Icon name="search" size="xs" variant="white" />
        </Button>
      </div>
    </div>
  );
}
