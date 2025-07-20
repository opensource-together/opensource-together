import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

import { ProjectRole } from "@/features/projects/types/project-role.type";
import { TechStack } from "@/features/projects/types/project.type";

/* ---------------------------------- Root ---------------------------------- */
const ProjectCard = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "font-geist rounded-[20px] border border-[black]/6 px-6.5 py-4 pt-7 transition-all duration-200 hover:cursor-pointer hover:shadow-[0_0_8px_rgba(0,0,0,0.1)]",
      className
    )}
    {...props}
  />
));
ProjectCard.displayName = "ProjectCard";

/* --------------------------------- Header --------------------------------- */
const ProjectCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <article
    ref={ref}
    className={cn("flex items-start justify-between", className)}
    {...props}
  />
));
ProjectCardHeader.displayName = "ProjectCardHeader";

/* ------------------------------- Left Group ------------------------------- */
const ProjectCardLeftGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3", className)}
    {...props}
  />
));
ProjectCardLeftGroup.displayName = "ProjectCardLeftGroup";

/* ---------------------------------- Image --------------------------------- */
interface ProjectCardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string | null;
  alt: string;
}

const ProjectCardImage = React.forwardRef<
  HTMLDivElement,
  ProjectCardImageProps
>(({ className, src, alt, ...props }, ref) => {
  let processedSrc = "/icons/empty-project.svg";

  if (typeof src === "string") {
    if (
      !src.startsWith("/") &&
      !src.includes("://") &&
      !src.startsWith("data:")
    ) {
      processedSrc = `/icons/${src}`;
    } else {
      processedSrc = src;
    }
  } else if (src) {
    processedSrc = src;
  }

  return (
    <div ref={ref} className={cn("relative size-12.5", className)} {...props}>
      <Image
        src={processedSrc}
        alt={alt}
        width={50}
        height={50}
        className="rounded-full"
      />
    </div>
  );
});
ProjectCardImage.displayName = "ProjectCardImage";

/* ---------------------------------- Info ---------------------------------- */
const ProjectCardInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
));
ProjectCardInfo.displayName = "ProjectCardInfo";

/* ---------------------------------- Title --------------------------------- */
const ProjectCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-medium tracking-tighter", className)}
    {...props}
  />
));
ProjectCardTitle.displayName = "ProjectCardTitle";

/* ------------------------------ Tech Stack ------------------------------- */
interface ProjectCardTechStackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  techStack: TechStack[];
}

const ProjectCardTechStack = React.forwardRef<
  HTMLDivElement,
  ProjectCardTechStackProps
>(({ className, techStack, ...props }, ref) => (
  <div ref={ref} className={cn("mt-1 flex gap-1", className)} {...props}>
    {techStack.map((tech, index) => {
      if (!tech.iconUrl) return null;
      return (
        <div key={tech.id || index} className="relative flex-shrink-0">
          <Image src={tech.iconUrl} alt={tech.name} width={15} height={15} />
        </div>
      );
    })}
  </div>
));
ProjectCardTechStack.displayName = "ProjectCardTechStack";

/* ---------------------------------- Stars --------------------------------- */
interface ProjectCardStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
}

const ProjectCardStars = React.forwardRef<
  HTMLDivElement,
  ProjectCardStarsProps
>(({ className, count, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-end justify-center gap-1 text-sm", className)}
    {...props}
  >
    <span className="flex items-center justify-center gap-1 rounded-[3px] border border-[black]/10 px-1.5 py-px">
      <span className="inline-flex items-center text-[black]/50">{count}</span>
      <Image
        src="/icons/empty-star.svg"
        alt="emptystarIcon"
        width={13}
        height={13}
        className="inline-block"
      />
    </span>
  </div>
));
ProjectCardStars.displayName = "ProjectCardStars";

/* ------------------------------- Content ---------------------------------- */
const ProjectCardContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <article ref={ref} className={cn("", className)} {...props} />
));
ProjectCardContent.displayName = "ProjectCardContent";

/* ----------------------------- Description -------------------------------- */
const ProjectCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-4 line-clamp-1 text-sm leading-5 font-medium tracking-tighter",
      className
    )}
    {...props}
  />
));
ProjectCardDescription.displayName = "ProjectCardDescription";

/* -------------------------------- Divider --------------------------------- */
const ProjectCardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-4 border-t border-black/3", className)}
    {...props}
  />
));
ProjectCardDivider.displayName = "ProjectCardDivider";

/* -------------------------------- Footer ---------------------------------- */
const ProjectCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    _rolesMeasurementRef?: React.Ref<HTMLDivElement>;
  }
>(({ className, _rolesMeasurementRef, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full items-center gap-3 overflow-hidden text-xs",
      className
    )}
    {...props}
  />
));
ProjectCardFooter.displayName = "ProjectCardFooter";

/* ------------------------------ Roles Count ------------------------------- */
interface ProjectCardRolesCountProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  counterRef?: React.RefObject<HTMLDivElement>;
}

const ProjectCardRolesCount = React.forwardRef<
  HTMLDivElement,
  ProjectCardRolesCountProps
>(({ className, count, counterRef, ...props }, ref) => (
  <div
    ref={counterRef || ref}
    className={cn(
      "flex flex-shrink-0 items-center gap-1 text-[10px] tracking-tighter",
      className
    )}
    {...props}
  >
    <span className="font-semibold">{count}</span> Rôles Disponibles
  </div>
));
ProjectCardRolesCount.displayName = "ProjectCardRolesCount";

/* ------------------------------ Roles List -------------------------------- */
interface ProjectCardRolesListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  roles: ProjectRole[];
  maxVisible?: number;
}

const ProjectCardRolesList = React.forwardRef<
  HTMLDivElement,
  ProjectCardRolesListProps
>(({ className, roles, maxVisible = roles.length, ...props }, ref) => {
  const visibleRoles = roles.slice(0, maxVisible);
  const remainingRoles = roles.length - maxVisible;

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {visibleRoles.map((role, index) => (
        <span
          key={index}
          className="flex h-5 flex-shrink-0 items-center rounded-full bg-[#1E1E1E]/[0.1] px-1 text-xs font-semibold tracking-tighter whitespace-nowrap text-[#1E1E1E]/[0.8]"
        >
          {role.title}
        </span>
      ))}
      {remainingRoles > 0 && (
        <span className="flex h-5 flex-shrink-0 items-center rounded-full bg-transparent px-1 text-xs font-semibold tracking-tighter whitespace-nowrap text-[black]/20">
          +{remainingRoles}
        </span>
      )}
    </div>
  );
});
ProjectCardRolesList.displayName = "ProjectCardRolesList";

/* ------------------------------- View Link -------------------------------- */
interface ProjectCardViewLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  projectId: string;
  linkRef?: React.Ref<HTMLAnchorElement>;
}

const ProjectCardViewLink = React.forwardRef<
  HTMLAnchorElement,
  ProjectCardViewLinkProps
>(({ className, projectId, linkRef, ...props }, ref) => (
  <Link
    ref={linkRef || ref}
    href={`/projects/${projectId}`}
    className={cn(
      "ml-auto flex flex-shrink-0 items-center gap-1 pt-1 text-xs font-medium tracking-tighter text-black/30 transition-opacity hover:opacity-80",
      className
    )}
    {...props}
  >
    Voir le projet{" "}
    <Image
      className=""
      src="/icons/right-arrow-icon.svg"
      alt="arrowupright"
      width={13}
      height={13}
    />
  </Link>
));
ProjectCardViewLink.displayName = "ProjectCardViewLink";

/* ------------------------------- View Text -------------------------------- */
interface ProjectCardViewTextProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ProjectCardViewText = React.forwardRef<
  HTMLDivElement,
  ProjectCardViewTextProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ml-auto flex flex-shrink-0 items-center gap-1 pt-1 text-xs font-medium tracking-tighter text-black/30",
      className
    )}
    {...props}
  >
    Voir le projet{" "}
    <Image
      className=""
      src="/icons/right-arrow-icon.svg"
      alt="arrowupright"
      width={13}
      height={13}
    />
  </div>
));
ProjectCardViewText.displayName = "ProjectCardViewText";

export {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardImage,
  ProjectCardInfo,
  ProjectCardLeftGroup,
  ProjectCardRolesCount,
  ProjectCardRolesList,
  ProjectCardStars,
  ProjectCardTechStack,
  ProjectCardTitle,
  ProjectCardViewLink,
  ProjectCardViewText,
};
