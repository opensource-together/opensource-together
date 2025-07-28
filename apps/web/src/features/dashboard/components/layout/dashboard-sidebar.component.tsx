"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Icon, IconName } from "@/shared/components/ui/icon";

const sidebarItems = [
  {
    label: "Accueil",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "Mes projets",
    href: "/dashboard/my-projects",
    icon: "mix",
  },
  {
    label: "Mes candidatures",
    href: "/dashboard/my-applications",
    icon: "file-text",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-16 flex-col border border-[black]/5 bg-stone-50/50 px-2 pt-5 lg:w-80 lg:px-6">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <Button asChild className="hidden w-full lg:flex">
          <Link href="/projects/create">
            Créer un Project
            <Plus className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {/* Mobile view */}
        <div className="flex justify-center lg:hidden">
          <Button asChild size="icon" className="size-9">
            <Link href="/projects/create">
              <Plus className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const linkContent = (
              <>
                <Icon
                  name={item.icon as IconName}
                  size="sm"
                  variant={isActive ? "default" : "gray"}
                  className="size-4"
                />
                <span className="hidden text-sm lg:inline">{item.label}</span>
              </>
            );

            return (
              <div key={item.label}>
                {/* Desktop view */}
                <Link
                  href={item.href}
                  className={`hidden items-center gap-3 rounded-md px-3 py-2 transition-colors lg:flex ${
                    isActive
                      ? "bg-stone-100 font-medium text-black"
                      : "text-black/50 hover:bg-stone-100"
                  }`}
                >
                  {linkContent}
                </Link>
                {/* Mobile view */}
                <Link
                  href={item.href}
                  className={`flex items-center justify-center rounded-md p-2 transition-colors lg:hidden ${
                    isActive
                      ? "bg-stone-100 font-medium text-black"
                      : "text-black/50 hover:bg-stone-100"
                  }`}
                >
                  <Icon
                    name={item.icon as IconName}
                    size="sm"
                    variant={isActive ? "default" : "gray"}
                    className="size-4"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
