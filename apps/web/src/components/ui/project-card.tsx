import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* ---------------------------------- Types --------------------------------- */
export interface TechIcon {
  icon: string
  alt: string
}

export interface Role {
  name: string
  color?: string
  bgColor?: string
}

/* ---------------------------------- Root ---------------------------------- */
const ProjectCard = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("shadow-xs font-geist rounded-[20px] border border[black]/10 w-[540px] h-[207px] py-[25px] px-[30px]", className)}
    {...props}
  />
))
ProjectCard.displayName = "ProjectCard"

/* --------------------------------- Header --------------------------------- */
const ProjectCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <article ref={ref} className={cn("flex justify-between items-start", className)} {...props} />
))
ProjectCardHeader.displayName = "ProjectCardHeader"

/* ------------------------------- Left Group ------------------------------- */
const ProjectCardLeftGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-4", className)} {...props} />
))
ProjectCardLeftGroup.displayName = "ProjectCardLeftGroup"

/* ---------------------------------- Image --------------------------------- */
interface ProjectCardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string | any
  alt: string
}

const ProjectCardImage = React.forwardRef<HTMLDivElement, ProjectCardImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    let processedSrc = "/icons/empty-project.svg"
    
    if (typeof src === "string") {
      if (!src.startsWith("/") && !src.includes("://") && !src.startsWith("data:")) {
        processedSrc = `/icons/${src}`
      } else {
        processedSrc = src
      }
    } else if (src) {
      processedSrc = src
    }
    
    return (
      <div ref={ref} className={cn("w-[50px] h-[50px] relative", className)} {...props}>
        <Image
          src={processedSrc}
          alt={alt}
          width={50}
          height={50}
          className="rounded-lg"
        />
      </div>
    )
  }
)
ProjectCardImage.displayName = "ProjectCardImage"

/* ---------------------------------- Info ---------------------------------- */
const ProjectCardInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
ProjectCardInfo.displayName = "ProjectCardInfo"

/* ---------------------------------- Title --------------------------------- */
const ProjectCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
ProjectCardTitle.displayName = "ProjectCardTitle"

/* ------------------------------ Tech Stack ------------------------------- */
interface ProjectCardTechStackProps extends React.HTMLAttributes<HTMLDivElement> {
  techStack: TechIcon[]
}

const ProjectCardTechStack = React.forwardRef<HTMLDivElement, ProjectCardTechStackProps>(
  ({ className, techStack, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-[3px] mt-1", className)} {...props}>
      {techStack.map((tech, index) => {
        if (!tech.icon) return null
        return (
          <div key={index} className="w-[15px] h-[15px] relative flex-shrink-0">
            <Image
              src={tech.icon}
              alt={tech.alt}
              width={15}
              height={15}
            />
          </div>
        )
      })}
    </div>
  )
)
ProjectCardTechStack.displayName = "ProjectCardTechStack"

/* ---------------------------------- Stars --------------------------------- */
interface ProjectCardStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number
}

const ProjectCardStars = React.forwardRef<HTMLDivElement, ProjectCardStarsProps>(
  ({ className, count, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-1 items-end justify-center text-sm", className)} {...props}>
      <span className="flex items-center gap-1 border rounded-[3px] border-[black]/10 justify-center px-[5px] py-[1px]">
        <span className="inline-flex items-center text-[black]/50">
          {count}
        </span>
        <Image
          src="/icons/empty-star.svg"
          alt="emptystarIcon"
          width={13}
          height={13}
          className="inline-block"
        />
      </span>
    </div>
  )
)
ProjectCardStars.displayName = "ProjectCardStars"

/* ------------------------------- Content ---------------------------------- */
const ProjectCardContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <article ref={ref} className={cn("", className)} {...props} />
))
ProjectCardContent.displayName = "ProjectCardContent"

/* ----------------------------- Description -------------------------------- */
const ProjectCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("text-[black]/50 font-medium text-[12px] leading-[20px] mt-4 line-clamp-2", className)} 
    {...props} 
  />
))
ProjectCardDescription.displayName = "ProjectCardDescription"

/* -------------------------------- Divider --------------------------------- */
const ProjectCardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("border-t border-dashed border-[black]/10 my-4", className)} 
    {...props} 
  />
))
ProjectCardDivider.displayName = "ProjectCardDivider"

/* -------------------------------- Footer ---------------------------------- */
const ProjectCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    rolesMeasurementRef?: React.Ref<HTMLDivElement>
  }
>(({ className, rolesMeasurementRef, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("flex items-center gap-2 text-[11px] w-full overflow-hidden", className)} 
    {...props} 
  />
))
ProjectCardFooter.displayName = "ProjectCardFooter"

/* ------------------------------ Roles Count ------------------------------- */
interface ProjectCardRolesCountProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number
  counterRef?: React.RefObject<HTMLDivElement>
}

const ProjectCardRolesCount = React.forwardRef<HTMLDivElement, ProjectCardRolesCountProps>(
  ({ className, count, counterRef, ...props }, ref) => (
    <div
      ref={counterRef || ref}
      className={cn("flex-shrink-0 text-[10px] font-medium flex items-center gap-1", className)}
      {...props}
    >
      <Image
        src="/icons/people.svg"
        alt="peopleicon"
        width={11}
        height={11}
      />{" "}
      {count} Roles Disponibles
    </div>
  )
)
ProjectCardRolesCount.displayName = "ProjectCardRolesCount"

/* ------------------------------ Roles List -------------------------------- */
interface ProjectCardRolesListProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: Role[]
  maxVisible?: number
}

const ProjectCardRolesList = React.forwardRef<HTMLDivElement, ProjectCardRolesListProps>(
  ({ className, roles, maxVisible = roles.length, ...props }, ref) => {
    const visibleRoles = roles.slice(0, maxVisible)
    const remainingRoles = roles.length - maxVisible
    
    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        {visibleRoles.map((role, index) => (
          <span 
            key={index}
            className="h-[22px] flex-shrink-0 flex items-center px-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#1E1E1E]/[0.1] text-[#1E1E1E]/[0.8]"
          >
            {role.name}
          </span>
        ))}
        {remainingRoles > 0 && (
          <span className="h-[22px] flex-shrink-0 flex items-center px-1 rounded-full text-[11px] font-semibold whitespace-nowrap text-[black]/20 bg-transparent">
            +{remainingRoles}
          </span>
        )}
      </div>
    )
  }
)
ProjectCardRolesList.displayName = "ProjectCardRolesList"

/* ------------------------------- View Link -------------------------------- */
interface ProjectCardViewLinkProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  projectId: string
  linkRef?: React.Ref<HTMLAnchorElement>
}

const ProjectCardViewLink = React.forwardRef<HTMLAnchorElement, ProjectCardViewLinkProps>(
  ({ className, projectId, linkRef, ...props }, ref) => (
    <Link
      ref={linkRef || ref}
      href={`/projects/${projectId}`}
      className={cn("ml-auto flex-shrink-0 text-[12px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity", className)}
      {...props}
    >
      Voir le projet{" "}
      <Image
        src="/icons/arrow-up-right.svg"
        alt="arrowupright"
        width={10}
        height={10}
      />
    </Link>
  )
)
ProjectCardViewLink.displayName = "ProjectCardViewLink"

export {
  ProjectCard,
  ProjectCardHeader,
  ProjectCardLeftGroup,
  ProjectCardImage,
  ProjectCardInfo,
  ProjectCardTitle,
  ProjectCardTechStack,
  ProjectCardStars,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardRolesCount,
  ProjectCardRolesList,
  ProjectCardViewLink
} 