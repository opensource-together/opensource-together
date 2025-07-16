import { Suspense } from "react";

import AuthLoading from "@/features/auth/components/auth-loading.component";
import LoginView from "@/features/auth/views/login.view";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <LoginView />
    </Suspense>
  );
}
