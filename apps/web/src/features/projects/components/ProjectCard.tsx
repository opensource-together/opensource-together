import arrowupright from "@/shared/icons/arrow-up-right.svg";
import emptystarIcon from "@/shared/icons/empty-star.svg";
import emptyprojecticon from "@/shared/icons/emptyprojectIcon.svg";
import peopleicon from "@/shared/icons/people.svg";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <section
      className={`shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.02)] font-geist rounded-[20px] border border[black]/10 w-[540px] h-[207px] py-[25px] px-[30px] ${className}`}
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
          <div className="text-[black]/50 font-medium text-[12px] leading-[20px] mt-4">
            {description}
          </div>
        )}
        {/* Line */}
        <div className="border-t border-dashed border-[black]/10 my-4" />

        {showRoles && (
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="text-[10px] font-medium flex items-center gap-1">
              <Image src={peopleicon} alt="peopleicon" width={11} height={11} />{" "}
              {roleCount} Open Roles
            </div>

            {roles.map((role, index) => (
              <div
                key={index}
                className="h-[18px] flex items-center px-2 rounded-full text-[10px]"
                style={{ color: role.color, backgroundColor: role.bgColor }}
              >
                {role.name}
              </div>
            ))}

            {roles.length > 3 && (
              <span className="text-[black]/20">+{roles.length - 3}</span>
            )}

            {showViewProject && (
              <Link
                href={`/projects/${projectId}`}
                className="text-[12px] font-semibold ml-auto flex items-center gap-1 hover:opacity-80 transition-opacity"
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
