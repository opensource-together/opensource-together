import Breadcrumb from "@/shared/components/shared/Breadcrumb";

/**
 * Displays a static error message and breadcrumb navigation when project data fails to load.
 *
 * Renders a breadcrumb trail and a styled error box informing the user of a loading failure, with instructions to try again later.
 */
export default function ProjectDetailContentError() {
  return (
    <>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Projets", href: "/projects" },
            { label: "Erreur", href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="mx-auto mt-4 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
        <div className="rounded-md bg-red-50 p-4 text-red-500">
          <h2 className="text-xl font-bold">
            Erreur lors du chargement des données du projet
          </h2>
          <p>
            Une erreur est survenue lors du chargement des données du projet.
            Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    </>
  );
}
