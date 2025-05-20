import emptystarIcon from "@/shared/icons/empty-star.svg";
import peopleicon from "@/shared/icons/people.svg";
import Image from "next/image";
import { mockProjects } from "../../projects/data/mockProjects";

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

export function ProjectCard({
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
      className={`shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.02)] font-geist bg-white rounded-[20px] border border-[black]/10 w-full max-w-[731px] min-h-[207px] py-5 px-8 ${className}`}
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
              <div className="w-[50px] h-[50px] bg-gray-100 rounded-sm" />
            )}
          </div>

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
          {showStars && (
            <div className="flex items-center border border-[black]/10 rounded-[3px] px-1 py-0.5">
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
        </div>
      </article>
    </section>
  );
}

export function ProjectList() {
  return (
    <div className="flex flex-col gap-4">
      {mockProjects.slice(0, 3).map((project) => (
        <ProjectCard
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          stars={project.communityStats?.stars ?? 0}
          roles={project.roles?.map(role => ({
            name: role.title,
            color: role.badges[0]?.color ?? "#000000",
            bgColor: role.badges[0]?.bgColor ?? "#FFFFFF"
          })) ?? []}
          roleCount={project.roles?.length ?? 0}
          techStack={project.techStacks?.map(tech => ({
            icon: tech.iconUrl ?? "",
            alt: tech.name
          })) ?? []}
        />
      ))}
    </div>
  );
}

export default ProjectCard;
