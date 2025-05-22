import StackIcon from "@/components/shared/StackIcon";
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeVariant } from "@/lib/utils/badges";
import { useLayoutEffect, useRef, useState } from "react";
import {
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
  ProjectCardTitle,
  ProjectCardViewLink,
  Role,
  TechIcon,
} from "@/components/ui/project-card";

interface ProjectCardProps {
  projectId?: string;
  title?: string;
  description?: string;
  techStack?: TechIcon[];
  showTechStack?: boolean;
  stars?: number;
  showStars?: boolean;
  roles?: Role[];
  roleCount?: number;
  showRoles?: boolean;
  showViewProject?: boolean;
  className?: string;
  image?: string;
}

export default function ProjectCardComponent({
  projectId = "1",
  title = "LeetGrind",
  description = "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
  techStack = [],
  showTechStack = true,
  stars = 0,
  showStars = true,
  roles = [],
  roleCount = 0,
  showRoles = true,
  showViewProject = true,
  className = "",
  image,
}: ProjectCardProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [maxVisible, setMaxVisible] = useState(roles.length);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    function measure() {
      if (!lineRef.current || !counterRef.current) return;
      const line = lineRef.current;
      const counter = counterRef.current;
      const btn = btnRef.current;
      // Largeur totale de la ligne
      const totalWidth = line.offsetWidth;
      // Largeur du compteur
      const counterWidth = counter.offsetWidth + 8;
      // Largeur du bouton
      const btnWidth = btn ? btn.offsetWidth + 8 : 0;
      // Largeur du badge +X
      let plusWidth = 0;
      if (roles.length > 0) {
        const temp = document.createElement("span");
        temp.className =
          "h-[18px] flex-shrink-0 flex items-center px-2 rounded-full text-[10px] whitespace-nowrap text-[black]/20";
        temp.style.visibility = "hidden";
        temp.innerText = "+" + (roles.length - 1);
        line.appendChild(temp);
        plusWidth = temp.offsetWidth + 8;
        line.removeChild(temp);
      }
      // Largeur disponible pour les rôles
      const available = totalWidth - counterWidth - btnWidth;
      // On va rendre les rôles un par un
      let used = 0;
      let visible = 0;
      // On crée des spans temporaires pour mesurer chaque rôle
      for (let i = 0; i < roles.length; i++) {
        const temp = document.createElement("span");
        temp.className =
          "h-[18px] flex-shrink-0 flex items-center px-2 rounded-full text-[10px] whitespace-nowrap";
        temp.style.visibility = "hidden";
        temp.innerText = roles[i].name;
        line.appendChild(temp);
        const roleWidth = temp.offsetWidth + 8;
        line.removeChild(temp);
        // Si on doit afficher le badge +X, il faut réserver la place
        const needPlus = i < roles.length - 1;
        if (used + roleWidth + (needPlus ? plusWidth : 0) > available) {
          break;
        }
        used += roleWidth;
        visible++;
      }
      setMaxVisible(visible);
      setMeasured(true);
    }
    measure();
    // ResizeObserver pour resize dynamique
    let ro: ResizeObserver | undefined;
    if (lineRef.current) {
      ro = new ResizeObserver(() => {
        setMeasured(false);
        setTimeout(measure, 10);
      });
      ro.observe(lineRef.current);
    }
    return () => {
      if (ro && lineRef.current) ro.disconnect();
    };
    // eslint-disable-next-line
  }, [roles, showViewProject, title, description]);

  const visibleRoles = measured ? roles.slice(0, maxVisible) : roles;
  const remainingRoles = measured ? roles.length - maxVisible : 0;

  return (
    <ProjectCard className={className}>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          <ProjectCardImage src={image || ""} alt={`${title} icon`} />
          <ProjectCardInfo>
            <ProjectCardTitle>{title}</ProjectCardTitle>
            {showTechStack && techStack.length > 0 && (
              <div className="flex gap-[3px] mt-1">
                {techStack.map((tech, index) => {
                  if (!tech.icon) return null;
                  return (
                    <StackIcon key={index} icon={tech.icon} alt={tech.alt} />
                  );
                })}
              </div>
            )}
          </ProjectCardInfo>
        </ProjectCardLeftGroup>

        {showStars && <ProjectCardStars count={stars} />}
      </ProjectCardHeader>

      <ProjectCardContent>
        {description && (
          <ProjectCardDescription>{description}</ProjectCardDescription>
        )}
        
        <ProjectCardDivider />

        {showRoles && (
          <ProjectCardFooter ref={lineRef as React.RefObject<HTMLDivElement>}>
            <ProjectCardRolesCount 
              count={roleCount} 
              counterRef={counterRef as React.RefObject<HTMLDivElement>}
            />

            {measured && (
              <>
                {roles.map((role, index) => {
                  if (index < maxVisible) {
                    return (
                      <Badge key={index} variant={getRoleBadgeVariant(role.name)}>
                        {role.name}
                      </Badge>
                    );
                  }
                  return null;
                })}
                {remainingRoles > 0 && (
                  <span className="h-[22px] flex-shrink-0 flex items-center px-1 rounded-full text-[11px] font-semibold whitespace-nowrap text-[black]/20 bg-transparent">
                    +{remainingRoles}
                  </span>
                )}
              </>
            )}

            {showViewProject && (
              <ProjectCardViewLink 
                projectId={projectId} 
                linkRef={btnRef as React.Ref<HTMLAnchorElement>}
              />
            )}
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}
