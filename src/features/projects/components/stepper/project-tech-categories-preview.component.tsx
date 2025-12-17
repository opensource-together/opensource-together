"use client";

import { CategoryList } from "@/shared/components/ui/category-list";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";
import type { CategoryType } from "@/shared/types/category.type";
import type { TechStackType } from "@/shared/types/tech-stack.type";

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
    <div className="flex flex-col rounded-2xl bg-accent p-8">
      <div className="mb-4 flex flex-col gap-6">
        <TechStackList
          title="Technical Stack"
          techs={projectTechStacks}
          emptyText="No technologies added"
        />
        <CategoryList
          title="Categories"
          categories={projectCategories}
          emptyText="No categories added"
          badgeVariant="white"
        />

        <ExternalLinks
          title="External Links"
          emptyText="No links added"
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
  );
}
