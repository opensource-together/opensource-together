"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-icons/hi";
import {
  HiChartBar,
  HiChatBubbleLeft,
  HiChevronRight,
  HiCog6Tooth,
  HiMiniSquare2Stack,
  HiQuestionMarkCircle,
  HiUserGroup,
} from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

const sidebarSections = [
  {
    items: [
      {
        label: "My Projects",
        href: "/dashboard/my-projects",
        icon: HiMiniSquare2Stack,
      },
    ],
  },
  {
    items: [
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
    ],
  },
];

const bottomSidebarItems = [
  { label: "Settings", href: "/dashboard/settings", icon: HiCog6Tooth },
  { label: "Need help", href: "/oss-guide", icon: HiQuestionMarkCircle },
];

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

function SidebarLink({
  item,
  isActive,
}: {
  item: SidebarItem;
  isActive: boolean;
}) {
  if (item.disabled) {
    return (
      <div className="group hidden cursor-not-allowed items-center justify-between gap-3 rounded-full px-4 py-2 opacity-50 transition-all duration-200 lg:flex">
        <span className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>{item.label}</span>
          <span className="translate-x-1 text-muted-foreground text-xs opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-75">
            Coming soon
          </span>
        </span>
        <item.icon className="size-4 text-muted-foreground" />
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
    <aside className="hidden w-16 flex-col border-muted-black-stroke px-2 pt-5 lg:ml-5 lg:flex lg:h-full lg:w-72">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-6">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {sectionIndex > 0 && <Separator className="mx-4" />}
              {section.items.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  isActive={isActive(item.href)}
                />
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="rounded-xl bg-secondary p-4">
            <div className="mb-3 text-start text-muted-foreground text-xs">
              Create a project for OpenSource Together. <br /> Import a
              repository from Github or Gitlab.
            </div>
            <Button
              asChild
              size="lg"
              className="hidden w-full justify-between lg:flex"
            >
              <Link href="/projects/create">
                Create a project
                <HiChevronRight size={12} />
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
