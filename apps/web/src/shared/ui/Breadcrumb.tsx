import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`font-geist text-[12px] font-normal ${className}`}>
      <ol className="flex items-center">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li className="mx-2 text-black/20">/</li>}
            <li>
              {item.isActive ? (
                <span className="text-black">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-black/20 hover:text-black/40 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
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
    <nav
      className={`font-geist text-[12px] font-normal animate-pulse ${className}`}
    >
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
