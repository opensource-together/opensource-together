"use client";

import Image from "next/image";

import { Button } from "@/shared/components/ui/button";

import useAuth from "@/features/auth/hooks/use-auth.hook";

interface GitHubButtonProps {
  text?: string;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export default function GoogleButton({
  text = "Continuer avec Google",
  isLoading = false,
  variant = "default",
}: GitHubButtonProps) {
  const { signInWithProvider } = useAuth();

  const isOutlineVariant = variant === "outline";

  return (
    <Button
      onClick={() => signInWithProvider("google")}
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
        <Image
          src={
            isOutlineVariant
              ? "/icons/new-google-icon-black.svg"
              : "/icons/new-google-icon-black.svg"
          }
          alt="Google"
          width={16}
          height={16}
        />
      )}
      <span className="ml-0">{text}</span>
    </Button>
  );
}
