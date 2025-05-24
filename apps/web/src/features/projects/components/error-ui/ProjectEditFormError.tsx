export default function ProjectEditFormError() {
  return (
    <div className="rounded-md bg-red-50 p-4 text-red-500">
      <h2 className="text-xl font-bold">
        Erreur lors du chargement des données du projet
      </h2>
      <p>
        Une erreur est survenue lors du chargement des données du projet.
        Veuillez réessayer plus tard.
      </p>
    </div>
  );
}
