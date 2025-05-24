import Breadcrumb from "@/components/shared/Breadcrumb";

import ProjectEditForm from "../components/ProjectEditForm";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  return (
    <>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Edit Project", href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
        <ProjectEditForm projectId={projectId} />
      </div>
    </>
  );
}
