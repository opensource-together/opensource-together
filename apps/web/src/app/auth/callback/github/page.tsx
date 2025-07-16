import { Suspense } from "react";

import AuthLoading from "@/features/auth/components/auth-loading.component";
import GithubCallbackView from "@/features/auth/views/github-callback.view";

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <GithubCallbackView />
    </Suspense>
  );
}
