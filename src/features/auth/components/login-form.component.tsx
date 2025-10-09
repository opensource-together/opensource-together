import GitHubButton from "./github-button.component";
import GitlabButton from "./gitlab-button.component";
import GoogleButton from "./google-button.component";

export default function LoginForm() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-2xl">Welcome to OpenSource Together</h1>
            <p className="mt-0 text-sm text-black/70">
              New here or coming back? Choose how you want to continue
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <GitHubButton text="Sign in with Github" />
            <GitlabButton text="Sign in with Gitlab" />
            <GoogleButton variant="outline" text="Sign in with Google" />
          </div>
        </div>
      </div>
    </div>
  );
}
