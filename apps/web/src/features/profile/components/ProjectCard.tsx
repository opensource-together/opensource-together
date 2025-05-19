import emptystarIcon from "@/shared/icons/empty-star.svg";
import exemplebyronIcon from "@/shared/icons/exemplebyronIcon.svg";
import mongodbIcon from "@/shared/icons/mongodb.svg";
import peopleicon from "@/shared/icons/people.svg";
import reactIcon from "@/shared/icons/react.svg";
import tailwindIcon from "@/shared/icons/tailwindcss.svg";
import typescriptIcon from "@/shared/icons/typescript (2).svg";
import Image from "next/image";

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
  description = "Un projet qui aide les utilisateurs à suivre et réduire leur empreinte carbone grâce aux choix quotidiens",
  techStack = [
    { icon: typescriptIcon, alt: "TypeScript" },
    { icon: reactIcon, alt: "React" },
    { icon: mongodbIcon, alt: "MongoDB" },
    { icon: tailwindIcon, alt: "TailwindCSS" },
  ],
  showTechStack = true,
  creator = "Byron Love",
  stars = 55,
  showCreator = true,
  showStars = true,
  roles = [
    { name: "Developeur Frontend", color: "#2B7FFF", bgColor: "#EFF6FF" },
    { name: "Designer UX", color: "#FF8904", bgColor: "#FFFBEB" },
    { name: "Developeur Backend", color: "#00C950", bgColor: "#F0FDF4" },
  ],
  roleCount = 5,
  showRoles = true,
  showViewProject = true,
  className = "",
}: ProjectCardProps) {
  return (
    <section
      className={`shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.02)] font-geist bg-white rounded-[20px] border border-[black]/10 w-full max-w-[731px] min-h-[207px] py-5 px-8 ${className}`}
    >
      <article className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] bg-gray-100 rounded-sm" />

          <div className="flex flex-col">
            <div className="text-lg font-medium">{title}</div>
            {showTechStack && techStack.length > 0 && (
              <div className="flex gap-1 mt-1">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="border border-[black]/10 rounded-[2px] w-[18px] h-[18px] flex items-center justify-center bg-white"
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

        <div className="flex gap-0 items-center text-sm">
          {showCreator && (
            <div className="flex items-center gap-1.5 border border-[black]/10 rounded-[3px] px-1.5 py-1">
              <Image
                className="mb-[0.5px]"
                src={exemplebyronIcon}
                alt="Byron Love"
                width={13}
                height={13}
              />
              <span className="text-[12px] text-[black]/80">{creator}</span>
            </div>
          )}
          {showStars && (
            <div className="flex items-center ml-2 border border-[black]/10 rounded-[3px] px-1 py-0.5">
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
          <div className="text-[10px] font-medium flex items-center gap-1 mr-2">
            <Image src={peopleicon} alt="peopleicon" width={11} height={11} />{" "}
            {roleCount} Rôles disponibles
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

          {/* View Project hidden for now

            {showViewProject && (
              <div className="text-[12px] font-medium ml-auto flex items-center gap-1">
                View Project <Image src={arrowupright} alt="arrowupright" width={10} height={10} />
              </div>
            )}

          */}
        </div>
      </article>
    </section>
  );
}
