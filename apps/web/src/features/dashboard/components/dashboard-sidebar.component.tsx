"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

const sidebarItems = [
  {
    label: "Accueil",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "Projets",
    href: "/dashboard/projects",
    icon: "mix",
  },
  {
    label: "Candidatures",
    href: "/dashboard/applications",
    icon: "file-text",
  },
  {
    label: "Contributions",
    href: "/dashboard/contributions",
    icon: "commit",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-80 flex-col border border-[black]/5 bg-stone-50/50 px-6 pt-5">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <Button asChild className="w-full">
          <Link href="/projects/create">
            Créer un Project
            <Plus className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="mt-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-stone-100 font-medium text-black"
                    : "text-black/50 hover:bg-stone-100"
                }`}
              >
                <Icon
                  name={item.icon as any}
                  size="sm"
                  variant={isActive ? "default" : "gray"}
                  className={`h-4 w-4`}
                />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
