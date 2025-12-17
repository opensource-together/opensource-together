"use client";

import { RiGitlabFill } from "react-icons/ri";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Button } from "@/shared/components/ui/button";

interface GitlabButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GitlabButton({
  text = "Sign in with Gitlab",
  isLoading = false,
  variant = "default",
}: GitlabButtonProps) {
  const { signInWithProvider } = useAuth();

  const isOutlineVariant = variant === "outline";

  return (
    <Button
      onClick={() => signInWithProvider("gitlab")}
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
        <RiGitlabFill
          className={
            isOutlineVariant ? "size-4 text-foreground" : "size-4 text-white"
          }
        />
      )}
      <span className="ml-1">{text}</span>
    </Button>
  );
}
