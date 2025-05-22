"use client";
import useAuth from "@/features/auth/hooks/useAuth";

export default function LoginForm() {
  const { signInWithGitHub } = useAuth();
  return (
    <div>
      <button onClick={signInWithGitHub}>Login with GitHub</button>
    </div>
  );
}
