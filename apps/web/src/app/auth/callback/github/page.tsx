"use client";

import { useEffect } from "react";

import useAuth from "@/features/auth/hooks/useAuth";

export default function GithubCallback() {
  const { redirect } = useAuth();

  useEffect(() => {
    redirect();
  }, [redirect]);
}
