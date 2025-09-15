import { Button } from "@/shared/components/ui/button";

export default function HomepageError() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="mb-2 text-2xl">Une erreur est survenue</h2>
      <p className="mb-8 text-center text-black/50">
        Impossible de charger la liste des projets.
        <br />
        Veuillez réessayer plus tard.
      </p>
      <Button onClick={() => window.location.reload()}>Réessayer</Button>
    </div>
  );
}
