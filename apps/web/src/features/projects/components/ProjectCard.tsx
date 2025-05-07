import emptyprojecticon from "@/shared/icons/emptyprojectIcon.svg";
import Image from "next/image";
import jsIcon from "@/shared/icons/jsIcon.svg";
import arrowupright from "@/shared/icons/arrow-up-right.svg";
import peopleicon from "@/shared/icons/people.svg";
import miniuserIcon from "@/shared/icons/mini-user-icon-empty.svg";
import emptystarIcon from "@/shared/icons/empty-star.svg";
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
  title?: string;
  description?: string;
  techStack?: TechIcon[];
  showTechStack?: boolean;
  creator?: string;
  stars?: number;
  showCreator?: boolean;
  showStars?: boolean;
  roles?: Role[];
  roleCount?: number;
  showRoles?: boolean;
  showViewProject?: boolean;
  className?: string;
}

export default function ProjectCard({
  title = "EcoTrack",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
  techStack = [
    { icon: jsIcon, alt: "jsIcon" },
    { icon: jsIcon, alt: "jsIcon" },
    { icon: jsIcon, alt: "jsIcon" },
    { icon: jsIcon, alt: "jsIcon" },
  ],
  showTechStack = true,
  creator = "Zinedine",
  stars = 55,
  showCreator = true,
  showStars = true,
  roles = [
    { name: "Front-end Developer", color: "#51A2FF", bgColor: "#DBEAFE" },
    { name: "UX Designer", color: "#FFB900", bgColor: "#FEF3C6" },
    { name: "MongoDB", color: "#05DF72", bgColor: "#DCFCE7" },
  ],
  roleCount = 5,
  showRoles = true,
  showViewProject = true,
  className = "",
}: ProjectCardProps) {
  return (
    <section className={`shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)] font-geist rounded-[20px] border border[black]/10 w-[540px] h-[207px] py-[25px] px-[30px] ${className}`}>
      <article className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Image src={emptyprojecticon} alt="emptyprojecticon" width={50} height={50} />

          <div className="flex flex-col">
            <div className="text-lg font-semibold">{title}</div>
            {showTechStack && techStack.length > 0 && (
              <div className="flex gap-[3px] mt-1">
                {techStack.map((tech, index) => (
                  <div key={index} className="border border-[black]/10 rounded-[2px] w-[20px] h-[20px] flex items-center justify-center">
                    <Image src={tech.icon} alt={tech.alt} width={10.22} height={10.22} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1 items-end justify-center text-sm">
          {showCreator && (
            <span className="border rounded-[3px] border-[black]/10 flex items-center justify-center gap-1 px-2 py-[2.5px]">
              <Image src={miniuserIcon} alt="miniuserIcon" width={13} height={13} className="inline-block" />
              <span className="inline-flex items-center text-[12px]">{creator}</span>
            </span>
          )}
          {showStars && (
            <span className="flex items-center gap-1 border rounded-[3px] border-[black]/10 flex items-center justify-center gap-1 px-[5px] py-[1px]">
              <span className="inline-flex items-center text-[black]/50">{stars}</span>
              <Image src={emptystarIcon} alt="emptystarIcon" width={13} height={13} className="inline-block" />
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
            <div className="text-[12px] font-medium flex items-center gap-1">
              {roleCount} Roles <Image src={peopleicon} alt="peopleicon" width={11} height={11} />
            </div>
            
            {roles.map((role, index) => (
              <div 
                key={index} 
                className="h-[18px] flex items-center px-2 rounded"
                style={{ color: role.color, backgroundColor: role.bgColor }}
              >
                {role.name}
              </div>
            ))}
            
            {roles.length > 3 && (
              <span className="text-[black]/20">+{roles.length - 3}</span>
            )}
            
            {showViewProject && (
              <Link href="/project" className="text-[12px] font-semibold ml-auto flex items-center gap-1 hover:opacity-80 transition-opacity">
                View Project <Image src={arrowupright} alt="arrowupright" width={10} height={10} />
              </Link>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
