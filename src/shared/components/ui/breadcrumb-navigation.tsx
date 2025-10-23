import Image from "next/image";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  className?: string;
}

export default function BreadcrumbNavigation({
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
