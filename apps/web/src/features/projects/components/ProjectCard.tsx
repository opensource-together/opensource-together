import arrowupright from "@/components/shared/icons/arrow-up-right.svg";
import emptystarIcon from "@/components/shared/icons/empty-star.svg";
import emptyprojecticon from "@/components/shared/icons/emptyprojectIcon.svg";
import peopleicon from "@/components/shared/icons/people.svg";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

interface TechIcon {
  icon: string;
  alt: string;
}

interface Role {
  name: string;
  color: string;
  bgColor: string;
}

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

export default function ProjectCard({
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
    <section
      className={`shadow-xs font-geist rounded-[20px] border border[black]/10 w-[540px] h-[207px] py-[25px] px-[30px] ${className}`}
    >
      <article className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] relative">
            {image ? (
              <Image
                src={image}
                alt={`${title} icon`}
                width={50}
                height={50}
                className="rounded-lg"
              />
            ) : (
              <Image
                src={emptyprojecticon}
                alt="emptyprojecticon"
                width={50}
                height={50}
              />
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-lg font-semibold">{title}</div>
            {showTechStack && techStack.length > 0 && (
              <div className="flex gap-[3px] mt-1">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="border border-[black]/10 rounded-[2px] w-[20px] h-[20px] flex items-center justify-center"
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.alt}
                      width={14.5}
                      height={10.22}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1 items-end justify-center text-sm">
          {showStars && (
            <span className="flex items-center gap-1 border rounded-[3px] border-[black]/10 justify-center px-[5px] py-[1px]">
              <span className="inline-flex items-center text-[black]/50">
                {stars}
              </span>
              <Image
                src={emptystarIcon}
                alt="emptystarIcon"
                width={13}
                height={13}
                className="inline-block"
              />
            </span>
          )}
        </div>
      </article>

      <article>
        {description && (
          <div className="text-[black]/50 font-medium text-[12px] leading-[20px] mt-4 line-clamp-2">
            {description}
          </div>
        )}
        {/* Line */}
        <div className="border-t border-dashed border-[black]/10 my-4" />

        {showRoles && (
          <div
            ref={lineRef}
            className="flex items-center gap-2 text-[11px] w-full overflow-hidden"
          >
            <div
              ref={counterRef}
              className="flex-shrink-0 text-[10px] font-medium flex items-center gap-1"
            >
              <Image src={peopleicon} alt="peopleicon" width={11} height={11} />{" "}
              {roleCount} Roles Disponibles
            </div>

            {/* Rôles dynamiques */}
            {visibleRoles.map((role, index) => (
              <div
                key={index}
                className="h-[18px] flex-shrink-0 flex items-center px-2 rounded-full text-[10px] whitespace-nowrap"
                style={{ color: role.color, backgroundColor: role.bgColor }}
              >
                {role.name}
              </div>
            ))}
            {remainingRoles > 0 && (
              <span className="h-[22px] flex-shrink-0 flex items-center px-1 rounded-full text-[11px] font-semibold whitespace-nowrap text-[black]/20 bg-transparent">
                +{remainingRoles}
              </span>
            )}

            {/* Bouton toujours à droite */}
            {showViewProject && (
              <Link
                ref={btnRef}
                href={`/projects/${projectId}`}
                className="ml-auto flex-shrink-0 text-[12px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                Voir le projet{" "}
                <Image
                  src={arrowupright}
                  alt="arrowupright"
                  width={10}
                  height={10}
                />
              </Link>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
