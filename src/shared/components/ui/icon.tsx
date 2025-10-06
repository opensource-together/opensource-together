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

export type IconName =
  | "github"
  | "gitlab"
  | "twitter"
  | "discord"
  | "last-commit"
  | "star"
  | "fork"
  | "people"
  | "search"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up-right"
  | "plus"
  | "cross"
  | "download"
  | "lock"
  | "link"
  | "linkedin"
  | "user"
  | "project"
  | "difficulty-bar"
  | "check"
  | "pencil"
  | "pinned"
  | "joined"
  | "logout"
  | "created-projects"
  | "trash"
  | "bagpack"
  | "home"
  | "file-text"
  | "mix"
  | "contact"
  | "commit"
  | "bell"
  | "chat";

const iconFiles: Record<IconName, Record<IconVariant, string | null>> = {
  github: {
    default: "/icons/github.svg",
    gray: "/icons/github-gray.svg",
    white: "/icons/github-white.svg",
    black: "/icons/github.svg",
    filled: "/icons/github.svg",
    outline: "/icons/github.svg",
  },
  linkedin: {
    default: "/icons/linkedin.svg",
    gray: "/icons/linkedin-gray.svg",
    white: "/icons/linkedin-white.svg",
    black: "/icons/linkedin.svg",
    filled: "/icons/linkedin.svg",
    outline: "/icons/linkedin.svg",
  },
  gitlab: {
    default: "/icons/gitlab.svg",
    gray: "/icons/gitlab-gray.svg",
    white: "/icons/gitlab-white.svg",
    black: "/icons/gitlab.svg",
    filled: "/icons/gitlab.svg",
    outline: "/icons/gitlab.svg",
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
    default: "/icons/discord.svg",
    gray: "/icons/discord-gray.svg",
    white: "/icons/discord-white.svg",
    black: "/icons/discord.svg",
    filled: "/icons/discord.svg",
    outline: "/icons/discord.svg",
  },
  star: {
    default: "/icons/empty-star.svg",
    gray: "/icons/star-gray.svg",
    white: "/icons/star-white.svg",
    black: "/icons/star.svg",
    filled: "/icons/star.svg",
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
    white: "/icons/chevron-left-white.svg",
    black: "/icons/chevron-left.svg",
    filled: "/icons/chevron-left.svg",
    outline: "/icons/chevron-left.svg",
  },
  "chevron-right": {
    default: "/icons/chevron-right.svg",
    gray: "/icons/chevron-right-gray.svg",
    white: "/icons/chevron-right-white.svg",
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
    white: "/icons/arrow-up-right-white.svg",
    black: "/icons/arrow-up-right.svg",
    filled: "/icons/arrow-up-right.svg",
    outline: "/icons/arrow-up-right.svg",
  },
  plus: {
    default: "/icons/plus.svg",
    gray: "/icons/plus-gray.svg",
    white: "/icons/plus-white.svg",
    black: "/icons/plus.svg",
    filled: "/icons/plus.svg",
    outline: "/icons/plus.svg",
  },
  cross: {
    default: "/icons/cross.svg",
    gray: "/icons/cross-gray.svg",
    white: "/icons/cross-white.svg",
    black: "/icons/cross.svg",
    filled: "/icons/cross.svg",
    outline: "/icons/cross.svg",
  },
  download: {
    default: "/icons/download.svg",
    gray: "/icons/download-gray.svg",
    white: "/icons/download-white.svg",
    black: "/icons/download.svg",
    filled: "/icons/download.svg",
    outline: "/icons/download.svg",
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
    default: "/icons/link.svg",
    gray: "/icons/link-gray.svg",
    white: "/icons/link.svg",
    black: "/icons/link.svg",
    filled: "/icons/link.svg",
    outline: "/icons/link.svg",
  },

  user: {
    default: "/icons/user.svg",
    gray: "/icons/user-gray.svg",
    white: "/icons/user-white.svg",
    black: "/icons/user.svg",
    filled: "/icons/user.svg",
    outline: "/icons/user.svg",
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
  check: {
    default: "/icons/check.svg",
    gray: "/icons/check-gray.svg",
    white: "/icons/check-white.svg",
    black: "/icons/check.svg",
    filled: "/icons/check.svg",
    outline: "/icons/check.svg",
  },
  pencil: {
    default: "/icons/pencil.svg",
    gray: "/icons/pencil-gray.svg",
    white: "/icons/pencil-white.svg",
    black: "/icons/pencil-black.svg",
    filled: "/icons/pencil-filled.svg",
    outline: "/icons/pencil-outline.svg",
  },
  pinned: {
    default: "/icons/pinned.svg",
    gray: "/icons/pinned-gray.svg",
    white: "/icons/pinned-white.svg",
    black: "/icons/pinned.svg",
    filled: "/icons/pinned.svg",
    outline: "/icons/pinned.svg",
  },
  joined: {
    default: "/icons/joined.svg",
    gray: "/icons/joined.svg",
    white: "/icons/joined.svg",
    black: "/icons/joined.svg",
    filled: "/icons/joined.svg",
    outline: "/icons/joined.svg",
  },
  logout: {
    default: "/icons/logout.svg",
    gray: "/icons/logout.svg",
    white: "/icons/logout.svg",
    black: "/icons/logout.svg",
    filled: "/icons/logout.svg",
    outline: "/icons/logout.svg",
  },
  "created-projects": {
    default: "/icons/created-projects-icon.svg",
    gray: "/icons/created-projects-icon.svg",
    white: "/icons/created-projects-icon.svg",
    black: "/icons/created-projects-icon.svg",
    filled: "/icons/created-projects-icon.svg",
    outline: "/icons/created-projects-icon.svg",
  },
  "last-commit": {
    default: "/icons/last-commit.svg",
    gray: "/icons/last-commit-gray.svg",
    white: "/icons/last-commit-white.svg",
    black: "/icons/last-commit.svg",
    filled: "/icons/last-commit.svg",
    outline: "/icons/last-commit.svg",
  },
  trash: {
    default: "/icons/trash.svg",
    gray: "/icons/trash-gray.svg",
    white: "/icons/trash-white.svg",
    black: "/icons/trash.svg",
    filled: "/icons/trash.svg",
    outline: "/icons/trash.svg",
  },
  bagpack: {
    default: "/icons/bagpack.svg",
    gray: "/icons/bagpack-gray.svg",
    white: "/icons/bagpack-white.svg",
    black: "/icons/bagpack.svg",
    filled: "/icons/bagpack.svg",
    outline: "/icons/bagpack.svg",
  },
  home: {
    default: "/icons/home.svg",
    gray: "/icons/home-gray.svg",
    white: "/icons/home-white.svg",
    black: "/icons/home.svg",
    filled: "/icons/home.svg",
    outline: "/icons/home.svg",
  },
  "file-text": {
    default: "/icons/file-text.svg",
    gray: "/icons/file-text-gray.svg",
    white: "/icons/file-text.svg",
    black: "/icons/file-text.svg",
    filled: "/icons/file-text.svg",
    outline: "/icons/file-text.svg",
  },
  mix: {
    default: "/icons/mix.svg",
    gray: "/icons/mix-gray.svg",
    white: "/icons/mix.svg",
    black: "/icons/mix.svg",
    filled: "/icons/mix.svg",
    outline: "/icons/mix.svg",
  },
  commit: {
    default: "/icons/commit.svg",
    gray: "/icons/commit-gray.svg",
    white: "/icons/commit.svg",
    black: "/icons/commit.svg",
    filled: "/icons/commit.svg",
    outline: "/icons/commit.svg",
  },
  bell: {
    default: "/icons/bell.svg",
    gray: "/icons/bell-gray.svg",
    white: "/icons/bell-white.svg",
    black: "/icons/bell.svg",
    filled: "/icons/bell.svg",
    outline: "/icons/bell.svg",
  },
  contact: {
    default: "/icons/contact-icon.svg",
    gray: "/icons/contact-icon.svg",
    white: "/icons/contact-icon.svg",
    black: "/icons/contact-icon.svg",
    filled: "/icons/contact-icon.svg",
    outline: "/icons/contact-icon.svg",
  },
  chat: {
    default: "/icons/chat.svg",
    gray: "/icons/chat-gray.svg",
    white: "/icons/chat-white.svg",
    black: "/icons/chat-black.svg",
    filled: "/icons/chat-filled.svg",
    outline: "/icons/chat-outline.svg",
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
