"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiChevronRight } from "react-icons/hi2";

import { useProfile } from "@/features/profile/hooks/use-profile.hook";
import { useProject } from "@/features/projects/hooks/use-projects.hook";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const routeConfig = {
    "/dashboard": () => [
      { label: "My Projects", href: "/dashboard/my-projects" },
    ],
    "/dashboard/settings": () => [
      { label: "Settings", href: "/dashboard/settings" },
    ],
    "/profile/me": () => [{ label: "Profile", href: "/profile/me" }],
    "/profile/me/edit": () => [
      { label: "Profile", href: "/profile/me" },
      { label: "Edit", href: "/profile/me/edit" },
    ],
    "/oss-guide": () => [{ label: "Guide", href: "/oss-guide" }],
  };

  const getData = () => {
    const projectIndex = segments.indexOf("projects");
    const profileIndex = segments.indexOf("profile");

    const publicProjectId =
      projectIndex !== -1 ? segments[projectIndex + 1] : undefined;
    const userId = profileIndex !== -1 ? segments[profileIndex + 1] : undefined;

    return {
      publicProjectId,
      userId,
    };
  };

  const { publicProjectId, userId } = getData();

  const { data: publicProject } = useProject(publicProjectId ?? "");
  const { data: publicProfile } = useProfile(userId ?? "");

  const getBreadcrumbItems = () => {
    if (routeConfig[pathname as keyof typeof routeConfig]) {
      return routeConfig[pathname as keyof typeof routeConfig]();
    }

    if (pathname.startsWith("/profile/") && userId && userId !== "me") {
      return [{ label: publicProfile?.name || "Profile", href: pathname }];
    }

    if (pathname.startsWith("/projects/") && publicProjectId) {
      if (pathname.endsWith("/edit")) {
        return [
          {
            label: publicProject?.title || "Project",
            href: `/projects/${publicProjectId}`,
          },
          { label: "Edit", href: pathname },
        ];
      }
      return [{ label: publicProject?.title || "Project", href: pathname }];
    }

    if (segments[0] === "dashboard" && segments.length > 1) {
      const breadcrumbItems = [];
      const segmentLabels = {
        "my-projects": "My Projects",
      };

      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        const label =
          segmentLabels[segment as keyof typeof segmentLabels] || segment;

        const href = `/${segments.slice(0, i + 1).join("/")}`;
        breadcrumbItems.push({ label, href });
      }

      return breadcrumbItems;
    }

    return [];
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex min-w-0 items-center space-x-1 overflow-hidden text-muted-foreground text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex min-w-0 items-center">
          <HiChevronRight size={12} className="mr-2 text-muted-foreground" />

          {index === breadcrumbItems.length - 1 ? (
            <span className="max-w-[50vw] truncate font-medium text-foreground md:max-w-[32rem] lg:max-w-[48rem]">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="max-w-[20vw] truncate transition-colors duration-200 hover:text-foreground md:max-w-[12rem] lg:max-w-[16rem]"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
