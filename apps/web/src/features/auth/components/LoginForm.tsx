import GitHubButton from "./GitHubButton";

export default function LoginForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <GitHubButton text="Se connecter avec GitHub" />
        <GitHubButton text="S'inscrire avec GitHub" variant="outline" />
      </div>
    </div>
  );
}
