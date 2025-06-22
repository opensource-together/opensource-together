import { Button } from "@/shared/components/ui/button";

/**
 * Renders a UI step for selecting a project creation method.
 *
 * Displays options to either import a project from GitHub or create a new project from scratch. Calls the provided `onNext` callback with the selected mode when an option is chosen.
 *
 * @param onNext - Callback invoked with the selected mode: "import" or "scratch"
 */
export default function StepOne({
  onNext,
}: {
  onNext: (mode: "import" | "scratch") => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[20px] bg-white p-10">
      <h2 className="font-geist mb-2 text-[30px] font-medium tracking-tight text-black">
        Choisissez votre méthode
      </h2>
      <p className="mb-8 text-center text-[15px] text-black/70">
        Importez un repository Github ou créez un projet depuis zéro.
      </p>
      <Button
        size="lg"
        className="mb-4 flex w-full items-center justify-center"
        onClick={() => onNext("import")}
      >
        Importer depuis Github{" "}
        <span className="">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"
            />
          </svg>
        </span>
      </Button>
      <div className="mb-2 text-[15px] text-black/70">ou</div>
      <Button
        variant="outline"
        size="lg"
        className="w-full items-center justify-center"
        onClick={() => onNext("scratch")}
      >
        Créer un projet depuis zéro
      </Button>
    </div>
  );
}
