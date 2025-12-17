"use client";

import { RiGithubFill } from "react-icons/ri";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Button } from "@/shared/components/ui/button";

interface GitHubButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GitHubButton({
  text = "Sign in with Github",
  isLoading = false,
  variant = "default",
}: GitHubButtonProps) {
  const { signInWithProvider } = useAuth();

  const isOutlineVariant = variant === "outline";

  return (
    <Button
      onClick={() => signInWithProvider("github")}
      disabled={isLoading}
      variant={isOutlineVariant ? "outline" : "default"}
      size="lg"
      className={`w-[320px] text-sm sm:text-base md:w-[420px] ${
        isOutlineVariant ? "border-none bg-[#FAFAF9]" : ""
      }`}
    >
      {isLoading ? (
        <div
          className={`size-4 animate-spin rounded-full border-2 ${
            isOutlineVariant ? "border-black/10" : "border-white"
          } border-t-transparent`}
        />
      ) : (
        <RiGithubFill
          className={
            isOutlineVariant
              ? "size-4.5 text-foreground"
              : "size-4.5 text-white"
          }
        />
      )}
      <span className="ml-1">{text}</span>
    </Button>
  );
}
