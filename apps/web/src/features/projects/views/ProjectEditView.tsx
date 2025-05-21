import Breadcrumb from "@/components/shared/ui/Breadcrumb";
import ProjectEditForm from "../components/ProjectEditForm";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  return (
    <>
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Edit Project", href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8">
        <ProjectEditForm projectId={projectId} />
      </div>
    </>
  );
}
