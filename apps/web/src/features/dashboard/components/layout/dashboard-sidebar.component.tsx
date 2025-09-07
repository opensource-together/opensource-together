"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-icons/hi";
import {
  HiChatBubbleLeft,
  HiChevronRight,
  HiCog6Tooth,
  HiInbox,
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
        label: "Projets",
        href: "/dashboard/my-projects",
        icon: HiMiniSquare2Stack,
      },
      {
        label: "Candidatures",
        href: "/dashboard/my-applications",
        icon: HiInbox,
      },
    ],
  },
  {
    items: [
      { label: "Chat", href: "/dashboard/chat", icon: HiChatBubbleLeft },
      {
        label: "Invitations",
        href: "/dashboard/invitations",
        icon: HiUserGroup,
      },
    ],
  },
];

const bottomSidebarItems = [
  { label: "Paramètres", href: "/settings", icon: HiCog6Tooth },
  { label: "Besoin d'aide", href: "/help", icon: HiQuestionMarkCircle },
];

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

function SidebarLink({
  item,
  isActive,
}: {
  item: SidebarItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`hidden items-center justify-between gap-3 rounded-full px-4 py-2 transition-colors lg:flex ${
        isActive
          ? "bg-secondary font-medium"
          : "hover:bg-secondary text-muted-foreground"
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
    <aside className="hidden w-16 flex-col border-[black]/5 px-2 pt-5 lg:ml-5 lg:flex lg:w-72">
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
          <div className="bg-secondary rounded-xl p-4">
            <div className="text-muted-foreground mb-3 text-center text-xs">
              Créer un projet pour OpenSource Together. Importer un repo Github
              ou depuis zéro.
            </div>
            <Button
              asChild
              size="lg"
              className="hidden w-full justify-between lg:flex"
            >
              <Link href="/projects/create">
                Créer un Projet
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
