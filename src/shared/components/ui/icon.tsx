import Image from "next/image";
import React from "react";

import { cn } from "@/shared/lib/utils";

export type IconSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconVariant =
  | "default"
  | "gray"
  | "white"
  | "black"
  | "filled"
  | "outline";

const iconSizes: Record<IconSize, string> = {
  xxs: "w-2 h-2", // 8px
  xs: "w-3 h-3", // 12px
  sm: "w-4 h-4", // 16px
  md: "w-5 h-5", // 20px
  lg: "w-6 h-6", // 24px
  xl: "w-8 h-8", // 32px
  "2xl": "w-10 h-10", // 40px
};

export type IconName = "last-commit" | "star" | "fork" | "people" | "download";

const iconFiles: Record<IconName, Record<IconVariant, string | null>> = {
  star: {
    default: "/icons/empty-star.svg",
    gray: "/icons/star-gray.svg",
    white: "/icons/star-white.svg",
    black: "/icons/star.svg",
    filled: "icons/white-star-filled.svg",
    outline: "/icons/empty-star.svg",
  },
  fork: {
    default: "/icons/fork.svg",
    gray: "/icons/fork-gray.svg",
    white: "/icons/fork.svg",
    black: "/icons/fork.svg",
    filled: "/icons/fork.svg",
    outline: "/icons/fork.svg",
  },
  people: {
    default: "/icons/people-contributor-icon.svg",
    gray: "/icons/people-gray.svg",
    white: "/icons/people.svg",
    black: "/icons/people.svg",
    filled: "/icons/people-filled.svg",
    outline: "/icons/people.svg",
  },
  download: {
    default: "/icons/download.svg",
    gray: "/icons/download-gray.svg",
    white: "/icons/download-white.svg",
    black: "/icons/download.svg",
    filled: "/icons/download.svg",
    outline: "/icons/download.svg",
  },
  "last-commit": {
    default: "/icons/last-commit.svg",
    gray: "/icons/last-commit-gray.svg",
    white: "/icons/last-commit-white.svg",
    black: "/icons/last-commit.svg",
    filled: "/icons/last-commit.svg",
    outline: "/icons/last-commit.svg",
  },
};

export interface IconProps {
  name: IconName;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  alt?: string;
  interactive?: boolean;
}

/**
 * Unified Icon component for the design system
 *
 * @example
 * ```tsx
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  variant = "default",
  className,
  alt,
  interactive = false,
}) => {
  const iconPath = iconFiles[name]?.[variant] || iconFiles[name]?.default;

  if (!iconPath) {
    console.warn(`Icon "${name}" with variant "${variant}" not found`);
    return null;
  }

  const sizeClass = iconSizes[size];
  const baseClasses = "inline-block object-contain";
  const interactiveClasses = interactive
    ? "transition-all duration-200 hover:opacity-70 cursor-pointer"
    : "";

  return (
    <Image
      src={iconPath}
      alt={alt || `${name} icon`}
      width={32}
      height={32}
      className={cn(baseClasses, sizeClass, interactiveClasses, className)}
      priority={false}
    />
  );
};

export default Icon;
