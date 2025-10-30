import { CategoryList } from "@/shared/components/ui/category-list";
import { ExternalLinks } from "@/shared/components/ui/external-link";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";

import { Profile } from "../types/profile.type";

interface ProfileSidebarProps {
  profile: Profile;
}

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const { userTechStacks = [], userCategories = [] } = profile;

  return (
    <div className="flex flex-1 flex-col gap-8">
      <TechStackList
        title="Technical Skills"
        techs={userTechStacks}
        emptyText="No skills added"
      />

      <CategoryList
        title="Interests"
        categories={userCategories}
        emptyText="No interests added"
      />

      <ExternalLinks
        title="Social Links"
        source={profile}
        emptyText="No links added"
      />
    </div>
  );
}
