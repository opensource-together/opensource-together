import Breadcrumb from "@/components/shared/Breadcrumb";

import SkeletonProjectDetail from "./SkeletonProjectDetail";

export default function SkeletonProjectDetailContent() {
  return (
    <>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Projets", href: "/projects" },
            { label: "Chargement...", href: "#", isActive: true },
          ]}
        />
      </div>
      <SkeletonProjectDetail />
    </>
  );
}
