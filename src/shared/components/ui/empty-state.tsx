"use client";

import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import { IconType } from "react-icons/lib";

import { Button } from "./button";

interface EmptyStateProps {
  text: string;
  icon?: IconType | React.ComponentType;
  href?: string;
  buttonText?: string;
  className?: string;
  width?: string;
}

export function EmptyState({
  text,
  icon,
  href,
  buttonText,
  className = "",
  width = "w-[400px]",
}: EmptyStateProps) {
  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center py-12 text-center ${width} ${className}`}
    >
      {icon && (
        <div className="text-neutral-200">
          {(() => {
            const IconComp = icon as IconType;
            return <IconComp size={36} aria-hidden />;
          })()}
        </div>
      )}
      <p className="mt-1 mb-4 max-w-40 text-[#B1B1B1]">{text}</p>
      {href && (
        <Link href={href}>
          <Button>
            {buttonText} <HiChevronRight />
          </Button>
        </Link>
      )}
    </div>
  );
}
