import GitHubButton from "./github-button.component";
import GoogleButton from "./google-button.component";

export default function LoginForm() {
  return (
    <div className="flex items-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-8 text-center tracking-tighter">
            <h1 className="mb-3 text-2xl font-medium text-gray-900">
              Bienvenue sur OpenSource Together
            </h1>
            <p className="mt-6 text-black/50">
              La plateforme qui connecte développeurs, designers et <br />
              créateurs à travers des projets open source.
            </p>
          </div>
          <div className="space-y-4">
            <GitHubButton text="Se connecter avec GitHub" />
            <GoogleButton variant="outline" text="Se connecter avec Google" />
          </div>
        </div>
      </div>
    </div>
  );
}
