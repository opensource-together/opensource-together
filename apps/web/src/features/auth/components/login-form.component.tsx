import GitHubButton from "./github-button.component";

export default function LoginForm() {
  return (
    <div className="flex items-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-8 text-center tracking-tight">
            <h1 className="mb-3 text-2xl font-medium text-gray-900">
              Bienvenue sur OpenSource Together
            </h1>
            <p className="text-sm text-black/50">
              Trouvez des projets, postulez à des rôles et collaborez —
              construisons ensemble grâce à l'open source
            </p>
          </div>
          <div className="space-y-4">
            <GitHubButton text="Se connecter avec GitHub" />
            <GitHubButton text="S'inscrire avec GitHub" variant="outline" />
          </div>
        </div>
      </div>
    </div>
  );
}
