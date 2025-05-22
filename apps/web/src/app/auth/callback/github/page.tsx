"use client";
import useAuth from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";

export default function GithubCallback() {
  const { redirect } = useAuth();

  useEffect(() => {
    redirect();
  }, [redirect]);
}
