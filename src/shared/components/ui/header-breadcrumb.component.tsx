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
    "/profile/me": () => [{ label: "Profile", href: "/profile/me" }],
    "/profile/me/edit": () => [
      { label: "Profile", href: "/profile/me" },
      { label: "Edit", href: "/profile/me/edit" },
    ],
  };

  const getData = () => {
    const publicProjectId = segments[segments.indexOf("projects") + 1];
    const userId = segments[segments.indexOf("profile") + 1];

    return {
      publicProjectId,
      userId,
    };
  };

  const { publicProjectId, userId } = getData();

  const { data: publicProject } = useProject(publicProjectId || "");
  const { data: publicProfile } = useProfile(userId || "");

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

        const href = "/" + segments.slice(0, i + 1).join("/");
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
    <nav className="text-muted-foreground flex items-center space-x-1 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <HiChevronRight size={12} className="text-muted-foreground mr-2" />

          {index === breadcrumbItems.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
