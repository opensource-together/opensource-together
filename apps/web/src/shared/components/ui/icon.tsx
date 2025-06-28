import Image from "next/image";
import React from "react";

import { cn } from "@/shared/lib/utils";

// Type for the icon size
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconVariant =
  | "default"
  | "gray"
  | "white"
  | "black"
  | "filled"
  | "outline";

// Mapping of the sizes with the Tailwind classes
const iconSizes: Record<IconSize, string> = {
  xs: "w-3 h-3", // 12px
  sm: "w-4 h-4", // 16px
  md: "w-5 h-5", // 20px
  lg: "w-6 h-6", // 24px
  xl: "w-8 h-8", // 32px
  "2xl": "w-10 h-10", // 40px
};

// List of the available icons based on the existing files
export type IconName =
  | "github"
  | "star"
  | "fork"
  | "people"
  | "search"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up-right"
  | "cross"
  | "lock"
  | "link"
  | "twitter"
  | "discord"
  | "linkedin"
  | "user"
  | "project"
  | "difficulty-bar"
  | "validation"
  | "writing"
  | "pinned"
  | "joined"
  | "created-projects";

// Mapping of the icon names to the SVG files
const iconFiles: Record<IconName, Record<IconVariant, string | null>> = {
  github: {
    default: "/icons/github.svg",
    gray: "/icons/github-gray.svg",
    white: "/icons/github-white.svg",
    black: "/icons/github.svg",
    filled: "/icons/github.svg",
    outline: "/icons/github.svg",
  },
  star: {
    default: "/icons/empty-star.svg",
    gray: "/icons/star-gray.svg",
    white: "/icons/empty-star.svg",
    black: "/icons/star.svg",
    filled: "/icons/star-filled-in-black.svg",
    outline: "/icons/empty-star.svg",
  },
  fork: {
    default: "/icons/branch-git-fork.svg",
    gray: "/icons/branch-git-fork-gray.svg",
    white: "/icons/branch-git-fork.svg",
    black: "/icons/branch-git-fork.svg",
    filled: "/icons/branch-git-fork.svg",
    outline: "/icons/branch-git-fork.svg",
  },
  people: {
    default: "/icons/people.svg",
    gray: "/icons/people-gray.svg",
    white: "/icons/people.svg",
    black: "/icons/people-filled-in-black.svg",
    filled: "/icons/people-filled-in-black.svg",
    outline: "/icons/people.svg",
  },
  search: {
    default: "/icons/search.svg",
    gray: "/icons/search-gray.svg",
    white: "/icons/search-white.svg",
    black: "/icons/search-black.svg",
    filled: "/icons/search.svg",
    outline: "/icons/search.svg",
  },
  "chevron-left": {
    default: "/icons/chevron-left.svg",
    gray: "/icons/chevron-left-gray.svg",
    white: "/icons/chevron-left.svg",
    black: "/icons/chevron-left.svg",
    filled: "/icons/chevron-left.svg",
    outline: "/icons/chevron-left.svg",
  },
  "chevron-right": {
    default: "/icons/chevron-right.svg",
    gray: "/icons/chevron-right-gray.svg",
    white: "/icons/chevron-right.svg",
    black: "/icons/chevron-right.svg",
    filled: "/icons/chevron-right.svg",
    outline: "/icons/chevron-right.svg",
  },
  "chevron-down": {
    default: "/icons/chevron-down.svg",
    gray: "/icons/chevron-down-gray.svg",
    white: "/icons/chevron-down.svg",
    black: "/icons/chevron-down.svg",
    filled: "/icons/chevron-down.svg",
    outline: "/icons/chevron-down.svg",
  },
  "arrow-up-right": {
    default: "/icons/arrow-up-right.svg",
    gray: "/icons/arrow-up-right-gray.svg",
    white: "/icons/arrow-up-right.svg",
    black: "/icons/arrow-up-right.svg",
    filled: "/icons/arrow-up-right.svg",
    outline: "/icons/arrow-up-right.svg",
  },
  cross: {
    default: "/icons/cross-icon.svg",
    gray: "/icons/cross-icon-gray.svg",
    white: "/icons/cross-icon.svg",
    black: "/icons/cross-icon.svg",
    filled: "/icons/cross-icon.svg",
    outline: "/icons/cross-icon.svg",
  },
  lock: {
    default: "/icons/lock.svg",
    gray: "/icons/lock.svg",
    white: "/icons/lock.svg",
    black: "/icons/lock.svg",
    filled: "/icons/lock.svg",
    outline: "/icons/lock.svg",
  },
  link: {
    default: "/icons/link-icon.svg",
    gray: "/icons/link-icon.svg",
    white: "/icons/link-icon.svg",
    black: "/icons/link-icon.svg",
    filled: "/icons/link-icon.svg",
    outline: "/icons/link-icon.svg",
  },
  twitter: {
    default: "/icons/twitter.svg",
    gray: "/icons/twitter-gray.svg",
    white: "/icons/twitter.svg",
    black: "/icons/x.svg",
    filled: "/icons/twitter.svg",
    outline: "/icons/twitter.svg",
  },
  discord: {
    default: "/icons/discord-icon.svg",
    gray: "/icons/discord-icon.svg",
    white: "/icons/discord-white.svg",
    black: "/icons/discord-icon.svg",
    filled: "/icons/discord-icon.svg",
    outline: "/icons/discord-icon.svg",
  },
  linkedin: {
    default: "/icons/linkedin.svg",
    gray: "/icons/linkedin-gray.svg",
    white: "/icons/linkedin.svg",
    black: "/icons/linkedin.svg",
    filled: "/icons/linkedin.svg",
    outline: "/icons/linkedin.svg",
  },
  user: {
    default: "/icons/mini-user-icon-empty.svg",
    gray: "/icons/mini-user-icon-gray.svg",
    white: "/icons/mini-user-icon-empty.svg",
    black: "/icons/mini-user-icon-empty.svg",
    filled: "/icons/mini-user-icon-empty.svg",
    outline: "/icons/mini-user-icon-empty.svg",
  },
  project: {
    default: "/icons/empty-project.svg",
    gray: "/icons/empty-project-gray.svg",
    white: "/icons/empty-project.svg",
    black: "/icons/empty-project.svg",
    filled: "/icons/empty-project.svg",
    outline: "/icons/empty-project.svg",
  },
  "difficulty-bar": {
    default: "/icons/Difficulty-bar-light.svg",
    gray: "/icons/Difficulty-bar-gray.svg",
    white: "/icons/Difficulty-bar-light.svg",
    black: "/icons/Difficulty-bar-light.svg",
    filled: "/icons/Difficulty-bar-light.svg",
    outline: "/icons/Difficulty-bar-light.svg",
  },
  validation: {
    default: "/icons/validation-icon.svg",
    gray: "/icons/validation-icon.svg",
    white: "/icons/validation-icon.svg",
    black: "/icons/validation-icon.svg",
    filled: "/icons/validation-icon.svg",
    outline: "/icons/validation-icon.svg",
  },
  writing: {
    default: "/icons/writing-icon.svg",
    gray: "/icons/writing-icon.svg",
    white: "/icons/writing-icon.svg",
    black: "/icons/writing-icon.svg",
    filled: "/icons/writing-icon.svg",
    outline: "/icons/writing-icon.svg",
  },
  pinned: {
    default: "/icons/pinned-icon.svg",
    gray: "/icons/pinned-icon.svg",
    white: "/icons/pinned-icon.svg",
    black: "/icons/pinned-icon.svg",
    filled: "/icons/pinned-icon.svg",
    outline: "/icons/pinned-icon.svg",
  },
  joined: {
    default: "/icons/joined.svg",
    gray: "/icons/joined.svg",
    white: "/icons/joined.svg",
    black: "/icons/joined.svg",
    filled: "/icons/joined.svg",
    outline: "/icons/joined.svg",
  },
  "created-projects": {
    default: "/icons/created-projects-icon.svg",
    gray: "/icons/created-projects-icon.svg",
    white: "/icons/created-projects-icon.svg",
    black: "/icons/created-projects-icon.svg",
    filled: "/icons/created-projects-icon.svg",
    outline: "/icons/created-projects-icon.svg",
  },
};

export interface IconProps {
  /** Icon name */
  name: IconName;
  /** Icon size */
  size?: IconSize;
  /** Icon variant */
  variant?: IconVariant;
  /** Additional CSS classes */
  className?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** If the icon should be interactive (hover effects) */
  interactive?: boolean;
}

/**
 * Unified Icon component for the design system
 *
 * @example
 * ```tsx
 * <Icon name="github" size="md" variant="default" />
 * <Icon name="star" size="lg" variant="filled" className="text-yellow-500" />
 * <Icon name="people" size="sm" variant="gray" interactive />
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
