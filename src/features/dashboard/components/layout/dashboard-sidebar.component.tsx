"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-icons/hi";
import {
  HiChartBar,
  HiChatBubbleLeft,
  HiCog6Tooth,
  HiMiniSquare2Stack,
  HiPlus,
  HiUserGroup,
} from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const sidebarNavItems: SidebarItem[] = [
  {
    label: "My Projects",
    href: "/dashboard/my-projects",
    icon: HiMiniSquare2Stack,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: HiChartBar,
    disabled: true,
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: HiChatBubbleLeft,
    disabled: true,
  },
  {
    label: "Invitations",
    href: "/dashboard/invitations",
    icon: HiUserGroup,
    disabled: true,
  },
];

const bottomSidebarItems = [
  { label: "Settings", href: "/dashboard/settings", icon: HiCog6Tooth },
];

function SidebarLink({
  item,
  isActive,
}: {
  item: SidebarItem;
  isActive: boolean;
}) {
  if (item.disabled) {
    return (
      <div className="group hidden cursor-not-allowed items-center justify-between gap-3 rounded-full px-4 py-2 text-muted-foreground transition-all duration-200 lg:flex">
        <span className="flex items-center gap-2 text-sm">
          <span>{item.label}</span>
          <span className="translate-x-1 text-xs opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-75">
            Coming soon
          </span>
        </span>
        <item.icon className="size-4" />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`hidden items-center justify-between gap-3 rounded-full px-4 py-2 transition-colors lg:flex ${
        isActive
          ? "bg-secondary font-medium"
          : "text-muted-foreground hover:bg-secondary"
      }`}
    >
      <span className="text-sm">{item.label}</span>
      <item.icon
        className={`size-4 ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`}
      />
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside className="hidden w-16 shrink-0 flex-col border-muted-black-stroke px-2 lg:ml-5 lg:flex lg:h-full lg:min-h-0 lg:w-72 lg:overflow-hidden">
      <div className="flex h-full min-h-0 flex-col justify-between overflow-hidden">
        <div className="shrink-0 space-y-3">
          {sidebarNavItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}
        </div>

        <div className="shrink-0">
          <div className="rounded-xl bg-secondary p-4">
            <div className="mb-3 text-start text-muted-foreground text-xs">
              Create a project for OpenSource Together. <br /> Import a
              repository from Github or Gitlab.
            </div>
            <Button
              asChild
              size="default"
              className="hidden w-full justify-between px-6 lg:flex"
            >
              <Link href="/projects/create">
                Create Project
                <HiPlus size={16} />
              </Link>
            </Button>
          </div>
          <div className="my-5 space-y-3">
            {bottomSidebarItems.map((item) => (
              <SidebarLink
                key={item.label}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
