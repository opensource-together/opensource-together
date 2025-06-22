export default function ProjectEditFormError() {
  return (
    <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        <div className="w-[710px] rounded-3xl border border-red-200 bg-red-50 p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className="text-xl font-semibold">
              Erreur lors du chargement des données du projet
            </h2>
          </div>
          <p className="mt-4 text-red-600">
            Une erreur est survenue lors du chargement des données du projet.
            Veuillez réessayer plus tard ou contacter le support si le problème
            persiste.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
