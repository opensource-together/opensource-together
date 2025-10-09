import { useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  CustomCombobox,
  CustomComboboxOption,
} from "@/shared/components/ui/custom-combobox";
import { fetchCategories } from "@/shared/services/category.service";
import { fetchTechStacks } from "@/shared/services/tech-stack.service";

interface FilterItemProps {
  label: string;
  value: string;
}

function FilterItem({ label, value }: FilterItemProps) {
  return (
    <div className="group flex h-12 w-37 cursor-pointer flex-col rounded-full px-8 py-2 transition-all duration-200 hover:rounded-full hover:bg-white">
      <span className="text-xs font-normal text-black/40 transition-colors duration-200">
        {label}
      </span>
      <span className="group-hover:text-primary text-xs font-medium tracking-tight whitespace-nowrap transition-colors duration-200">
        {value}
      </span>
    </div>
  );
}

export default function FilterSearchBar() {
  const [techOptions, setTechOptions] = useState<CustomComboboxOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<
    CustomComboboxOption[]
  >([]);
  const [roleOptions, _setRoleOptions] = useState<CustomComboboxOption[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [techs, cats] = await Promise.all([
        fetchTechStacks(),
        fetchCategories(),
      ]);
      if (!mounted) return;
      setTechOptions(
        techs.map((t) => ({ id: t.id, name: t.name, type: t.type }))
      );
      setCategoryOptions(cats.map((c) => ({ id: c.id, name: c.name })));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const languageAndTechOptions = useMemo(() => techOptions, [techOptions]);

  const handleTechStacksChange = (_ids: string[]) => {};

  const handleCategoriesChange = (_ids: string[]) => {};

  const handleRolesChange = (_ids: string[]) => {};

  return (
    <div
      className="mb-[19px] flex h-12.5 w-[592px] items-center justify-center"
      role="search"
    >
      <div className="relative flex h-full w-full items-center rounded-full border border-black/5 bg-white shadow-md shadow-black/3 backdrop-blur-lg hover:rounded-full">
        <div className="flex h-full w-full items-center rounded-full transition-colors duration-200 hover:rounded-full hover:border-black/5 hover:bg-black/5">
          <div className="flex items-center">
            <div className="relative pr-0">
              <CustomCombobox
                options={languageAndTechOptions}
                value={[]}
                onChange={handleTechStacksChange}
                placeholder="Technologies"
                searchPlaceholder="Rechercher une techno..."
                emptyText="Aucune techno"
                maxSelections={6}
                showTags={false}
                trigger={<FilterItem label="Choose" value="Technologies" />}
              />
            </div>

            <div className="z-10 mx-1 h-5 w-px self-center bg-black/10" />

            <div className="relative pr-0">
              <CustomCombobox
                options={categoryOptions}
                value={[]}
                onChange={handleCategoriesChange}
                placeholder="Catégories"
                searchPlaceholder="Rechercher une catégorie..."
                emptyText="Aucune catégorie"
                maxSelections={4}
                showTags={false}
                trigger={<FilterItem label="Select" value="Categories" />}
              />
            </div>

            <div className="z-10 mx-1 h-5 w-px self-center bg-black/10" />

            <div className="relative pr-0">
              <CustomCombobox
                options={[]}
                value={[]}
                onChange={handleTechStacksChange}
                placeholder="Most Popular"
                searchPlaceholder="Rechercher un tri..."
                emptyText="Aucun tri"
                maxSelections={6}
                showTags={false}
                trigger={<FilterItem label="Sort" value="Most Popular" />}
              />
            </div>
          </div>
        </div>
        <Button
          type="button"
          className="pointer-events-auto absolute right-2 h-8.5 px-4 text-sm"
          onClick={() => {}}
        >
          Filter Projects
        </Button>
      </div>
    </div>
  );
}
