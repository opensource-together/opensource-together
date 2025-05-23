import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  className?: string;
}

export default function BreadcrumbComponent({
  items,
  className = "",
}: BreadcrumbProps) {
  return (
    <Breadcrumb className={`font-geist ${className}`}>
      <BreadcrumbList className="mx-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator className="mx-1" />}
            <BreadcrumbItem>
              {item.isActive ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SkeletonBreadcrumb({
  itemCount = 3,
  className = "",
}: {
  itemCount?: number;
  className?: string;
}) {
  return (
    <nav className={`text-xs font-normal animate-pulse ${className}`}>
      <ol className="flex items-center">
        {Array.from({ length: itemCount }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li className="mx-2 text-black/20">/</li>}
            <li>
              <div
                className={`h-3 ${index === itemCount - 1 ? "w-20 bg-gray-300" : "w-12 bg-gray-200"} rounded`}
              ></div>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
