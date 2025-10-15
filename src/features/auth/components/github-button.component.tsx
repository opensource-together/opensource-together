"use client";

import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";

import useAuth from "@/features/auth/hooks/use-auth.hook";

interface GitHubButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GitHubButton({
  text = "Login with Github",
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
      className={`w-[320px] text-xs sm:text-base md:w-[420px] ${
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
        <Icon name="github" size="sm" variant="white" />
      )}
      <span className="ml-0">{text}</span>
    </Button>
  );
}
