export default function ProjectGridError() {
  return (
    <div className="rounded-md bg-red-50 p-4 text-red-500">
      <h2 className="text-xl font-bold">
        Erreur lors du chargement des projets
      </h2>
      <p>
        Une erreur est survenue lors du chargement des projets. Veuillez
        réessayer plus tard.
      </p>
    </div>
  );
}
