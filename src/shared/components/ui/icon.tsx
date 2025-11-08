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

export type IconName = "download";

const iconFiles: Record<IconName, Record<IconVariant, string | null>> = {
  download: {
    default: "/icons/download.svg",
    gray: "/icons/download-gray.svg",
    white: "/icons/download-white.svg",
    black: "/icons/download.svg",
    filled: "/icons/download.svg",
    outline: "/icons/download.svg",
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
