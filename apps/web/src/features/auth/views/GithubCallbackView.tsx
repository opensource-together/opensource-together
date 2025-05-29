"use client";

import { useEffect } from "react";

import useAuth from "../hooks/useAuth";

export default function GithubCallbackView() {
  const { redirectAfterGitHub } = useAuth();

  useEffect(() => {
    redirectAfterGitHub();
  }, [redirectAfterGitHub]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
      <p className="text-lg font-medium text-gray-600">
        Redirection en cours...
      </p>
    </div>
  );
}
