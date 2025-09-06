import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { MyProjectType } from "../../types/my-projects.type";

interface MyProjectDetailsHeadingComponentProps {
  project: MyProjectType;
}

export default function MyProjectDetailsHeadingComponent({
  project,
}: MyProjectDetailsHeadingComponentProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar
          src={project.image}
          name={project.title}
          alt={project.title}
          size="2xl"
        />
        <h1 className="text-start text-2xl font-medium sm:text-3xl">
          {project.title}
        </h1>
      </div>
      <Link href={`/projects/${project.id}`}>
        <Button>
          Voir le projet <HiArrowUpRight />
        </Button>
      </Link>
    </div>
  );
}
