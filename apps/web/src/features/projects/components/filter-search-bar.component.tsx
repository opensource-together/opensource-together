import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="flex cursor-pointer flex-col rounded-full px-4 py-1 transition-colors hover:bg-gray-50">
      <span className="text-[11px] font-normal text-black/50">{label}</span>
      <span className="text-xs font-medium tracking-tight">{value}</span>
    </div>
  );
}

export default function FilterSearchBar() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4 rounded-full border border-black/5 bg-white px-2 py-1 shadow-md shadow-black/3 backdrop-blur-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="relative pr-4">
              <FilterItem label="Filtrer par" value="Technologie" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="relative px-4">
              <FilterItem label="Filtrer par" value="Role" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="relative px-4">
              <FilterItem label="Filtrer par" value="Catégorie" />
              <div className="absolute top-1/2 right-0 h-8 -translate-y-1/2" />
            </div>
            <div className="pl-4">
              <FilterItem label="Trier par" value="Plus Récent" />
            </div>
          </div>
        </div>

        <Button className="px-4">
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
