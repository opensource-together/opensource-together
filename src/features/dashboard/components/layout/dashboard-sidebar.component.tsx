"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "react-icons/hi";
import {
  HiChartBar,
  HiChatBubbleLeft,
  HiCog6Tooth,
  HiMiniSquare2Stack,
  HiPlus,
  HiUserGroup,
} from "react-icons/hi2";
import { RiSideBarFill } from "react-icons/ri";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

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

const blurSlide = {
  initial: { opacity: 0, filter: "blur(6px)", x: -8 },
  animate: { opacity: 1, filter: "blur(0px)", x: 0 },
  exit: { opacity: 0, filter: "blur(6px)", x: -8 },
};

const blurTransition = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

function SidebarLink({
  item,
  isActive,
  collapsed,
}: {
  item: SidebarItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  if (item.disabled) {
    return (
      <div
        className={cn(
          "group hidden cursor-not-allowed items-center rounded-full px-4 py-2 text-muted-foreground transition-all duration-300 lg:flex",
          collapsed ? "justify-center px-2" : "justify-between gap-3"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.span
              key="icon"
              {...blurSlide}
              transition={blurTransition}
              className="flex"
            >
              <item.icon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="full"
              {...blurSlide}
              transition={blurTransition}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2 text-sm">
                <span>{item.label}</span>
                <span className="translate-x-1 text-xs opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-75">
                  Coming soon
                </span>
              </span>
              <item.icon className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "hidden items-center rounded-full px-4 py-2 transition-colors duration-300 lg:flex",
        collapsed ? "justify-center px-2" : "justify-between gap-3",
        isActive
          ? "bg-secondary font-medium"
          : "text-muted-foreground hover:bg-secondary"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <motion.span
            key="icon"
            {...blurSlide}
            transition={blurTransition}
            className="flex"
          >
            <item.icon
              className={cn(
                "size-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </motion.span>
        ) : (
          <motion.span
            key="full"
            {...blurSlide}
            transition={blurTransition}
            className="flex w-full items-center justify-between gap-3"
          >
            <span className="text-sm">{item.label}</span>
            <item.icon
              className={cn(
                "size-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-muted-black-stroke px-2 lg:ml-5 lg:flex lg:h-full lg:min-h-0 lg:overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-12 lg:w-12" : "w-16 lg:w-72"
      )}
    >
      <div className="flex h-full min-h-0 flex-col justify-between overflow-hidden">
        <div className="shrink-0 space-y-3">
          {sidebarNavItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="shrink-0">
          {/* Create Project card — blurs out/in on collapse */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="create-card"
                initial={{ opacity: 0, filter: "blur(8px)", x: -12 }}
                animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)", x: -12 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 268 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          <div className="my-5 space-y-3">
            {bottomSidebarItems.map((item) => (
              <SidebarLink
                key={item.label}
                item={item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}

            {/* Hide / Show sidebar toggle */}
            <button
              type="button"
              title={collapsed ? "Show sidebar" : "Hide sidebar"}
              onClick={() => setCollapsed((c) => !c)}
              className={cn(
                "hidden w-full cursor-pointer items-center rounded-full px-4 py-2 text-muted-foreground transition-colors hover:bg-secondary lg:flex",
                collapsed ? "justify-center px-2" : "justify-between gap-3"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {collapsed ? (
                  <motion.span
                    key="expand"
                    {...blurSlide}
                    transition={blurTransition}
                    className="flex"
                  >
                    <RiSideBarFill className="size-4" aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="collapse"
                    {...blurSlide}
                    transition={blurTransition}
                    className="flex w-full items-center justify-between gap-3"
                  >
                    <span className="text-sm">Hide Sidebar</span>
                    <RiSideBarFill className="size-4" aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
