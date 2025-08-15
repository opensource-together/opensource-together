import Image from "next/image";
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
  href?: string;
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
    <Breadcrumb className={className}>
      <BreadcrumbList className="gap-3 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isActive ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.href || ""}
                  className="text-black/50"
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Image
                  src="/icons/chevron.svg"
                  alt="chevron"
                  width={5}
                  height={5}
                />
              </BreadcrumbSeparator>
            )}
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
    <nav className={`animate-pulse text-xs font-normal ${className}`}>
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
