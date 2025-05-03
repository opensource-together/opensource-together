import emptyprojecticon from "@/shared/icons/emptyprojectIcon.svg";
import Image from "next/image";
import jsIcon from "@/shared/icons/jsIcon.svg";
import arrowupright from "@/shared/icons/arrow-up-right.svg";
import peopleicon from "@/shared/icons/people.svg";
import miniuserIcon from "@/shared/icons/mini-user-icon-empty.svg";
import emptystarIcon from "@/shared/icons/empty-star.svg";

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
    { name: "UX Designer", color: "#FFB900", bgColor: "#FEF3C6" },
    { name: "Front-end Developer", color: "#51A2FF", bgColor: "#DBEAFE" },
    { name: "MongoDB", color: "#05DF72", bgColor: "#DCFCE7" },
  ],
  roleCount = 5,
  showRoles = true,
  showViewProject = true,
  className = "",
}: ProjectCardProps) {
  return (
    <section className={`font-geist bg-white rounded-[20px] border border-[black]/10 w-full max-w-[731px] h-[207px] py-5 px-8 ${className}`}>
      <article className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] bg-gray-100 rounded-sm" />

          <div className="flex flex-col">
            <div className="text-lg font-medium">{title}</div>
            {showTechStack && techStack.length > 0 && (
              <div className="flex gap-1 mt-1">
                {techStack.map((tech, index) => (
                  <div key={index} className="border border-[black]/10 rounded-[2px] w-[18px] h-[18px] flex items-center justify-center bg-white">
                    <Image src={tech.icon} alt={tech.alt} width={11} height={8} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-0 items-center text-sm">
          {showCreator && (
            <div className="flex items-center gap-1.5 border border-[black]/10 rounded-[2px] px-1.5 py-1">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <span className="text-[12px] text-[black]/80">{creator}</span>
            </div>
          )}
          {showStars && (
            <div className="flex items-center ml-2 border border-[black]/10 rounded-[2px] px-1 py-0.5">
              <span className="text-[14px] text-[black]/50 mr-1">{stars}</span>
              <div className="w-3.5 h-3.5">
                <Image src={emptystarIcon} alt="stars" width={14} height={14} />
              </div>
            </div>
          )}
        </div>
      </article>

      <article>
        {description && (
          <div className="text-[black]/50 text-[12px] w-120 leading-[20px] mt-4">
            {description}
          </div>
        )}

        {/* Line */}
        <div className="border-t border-dashed border-[black]/10 my-4" />

        <div className="flex flex-wrap items-center gap-2 text-[11px] mt-5">
          <div className="text-[12px] font-medium flex items-center gap-1 mr-2">
            {roleCount} Roles <Image src={peopleicon} alt="peopleicon" width={11} height={11} />
          </div>
          
          {roles.map((role, index) => (
            <div 
              key={index} 
              className="h-5 flex items-center px-2 rounded-[3px] text-[11px]"
              style={{ color: role.color, backgroundColor: role.bgColor }}
            >
              {role.name}
            </div>
          ))}
          
          {roles.length > 3 && (
            <span className="text-[black]/20">+{roles.length - 3}</span>
          )}
          
          {showViewProject && (
            <div className="text-[12px] font-medium ml-auto flex items-center gap-1">
              View Project <Image src={arrowupright} alt="arrowupright" width={10} height={10} />
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
