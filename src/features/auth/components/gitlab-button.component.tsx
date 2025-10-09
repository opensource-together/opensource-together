"use client";

import { FiGitlab } from "react-icons/fi";

import { Button } from "@/shared/components/ui/button";

import useAuth from "@/features/auth/hooks/use-auth.hook";

interface GitlabButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GitlabButton({
  text = "Continuer avec Gitlab",
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
        <FiGitlab size={16} />
      )}
      <span className="ml-0">{text}</span>
    </Button>
  );
}
