"use client";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Badge } from "@/shared/components/ui/badge";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { CategoryType } from "@/shared/types/category.type";
import { TechStackType } from "@/shared/types/tech-stack.type";

interface ProjectTechCategoriesPreviewProps {
  projectTechStacks: TechStackType[];
  projectCategories: CategoryType[];
  githubUrl: string;
  gitlabUrl: string;
  discordUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

export function ProjectTechCategoriesPreview({
  projectTechStacks,
  projectCategories,
  githubUrl,
  gitlabUrl,
  discordUrl,
  twitterUrl,
  linkedinUrl,
  websiteUrl,
}: ProjectTechCategoriesPreviewProps) {
  return (
    <div className="bg-accent flex flex-col rounded-2xl p-8">
      <div className="mb-4 flex flex-col gap-6">
        <div className="mb-2 flex flex-col">
          <h2 className="mb-4 text-sm">Technical Stack</h2>
          {projectTechStacks.length > 0 && (
            <div className="flex w-full flex-wrap gap-2.5 gap-y-2">
              {projectTechStacks.map((tech, index) => (
                <StackLogo
                  key={index}
                  name={tech.name}
                  icon={tech.iconUrl || "/icons/empty-project.svg"}
                  alt={tech.name}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mb-2 flex flex-col">
          <h2 className="mb-4 text-sm">Categories</h2>
          <div className="flex flex-wrap gap-1">
            {projectCategories.map((category, index) => (
              <Badge variant="gray" key={index}>
                #{category.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-2 flex flex-col">
          <h2 className="mb-3 text-sm">External Links</h2>
          <ExternalLinks
            source={{
              githubUrl,
              gitlabUrl,
              discordUrl,
              twitterUrl,
              linkedinUrl,
              websiteUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}
