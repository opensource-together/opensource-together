"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import HomepageViews from "@/features/projects/views/HomepageViews";

export default function HomePage() {
  return (
    <main>
      <LoginForm />
      {/*Your app components*/}
      <HomepageViews />
    </main>
  );
}
