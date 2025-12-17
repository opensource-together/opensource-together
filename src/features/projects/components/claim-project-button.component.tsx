"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { RiGithubFill, RiGitlabFill } from "react-icons/ri";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";

import { useClaimProject } from "../hooks/use-projects.hook";
import type { Project } from "../types/project.type";

interface ClaimProjectButtonProps {
  project: Project;
}

function extractRepoPath(repoUrl: string | null): string | null {
  if (!repoUrl) return null;

  try {
    const url = new URL(repoUrl);
    return url.pathname.replace(/^\//, "").replace(/\.git$/, "");
  } catch {
    return repoUrl
      .split("/")
      .slice(3)
      .join("/")
      .replace(/\.git$/, "");
  }
}

export function ClaimProjectButton({ project }: ClaimProjectButtonProps) {
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const projectId = project.id || project.publicId || "";

  const { claimProject, isClaiming } = useClaimProject(projectId);

  if (project.owner?.id) {
    return null;
  }

  const handleVerifyAndClaim = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    claimProject(undefined, {
      onSuccess: () => setIsClaimOpen(false),
    });
  };

  const repoPath = extractRepoPath(project.repoUrl);
  const ProviderIcon =
    project.provider === "GITHUB" ? RiGithubFill : RiGitlabFill;

  return (
    <>
      <Button variant="outline" onClick={() => setIsClaimOpen(true)}>
        Claim Project
      </Button>
      <Modal
        open={isClaimOpen}
        onOpenChange={setIsClaimOpen}
        title="Take ownership of this project"
        description={`Take ownership of ${project.title} to help manage this project and grow the open source community.`}
        onCancel={() => setIsClaimOpen(false)}
        cancelText="Cancel"
        onConfirm={handleVerifyAndClaim}
        confirmText="Verify & Claim"
        isLoading={isClaiming}
      >
        <div className="space-y-4 py-2">
          {/* Repository Section */}
          {project.repoUrl && (
            <div className="rounded-2xl border border-muted-black-stroke p-4">
              <div className="mb-2 flex items-center gap-2">
                <ProviderIcon size={20} className="shrink-0" />
                <span className="font-medium text-sm">Source Repository</span>
              </div>
              <span className="break-all rounded-md bg-accent px-2 py-1 font-mono text-sm">
                {repoPath || project.repoUrl}
              </span>
            </div>
          )}

          {/* Ownership Requirements Section */}
          <div className="rounded-2xl border border-muted-black-stroke p-4">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm">What you need to know</span>
            </div>
            <p className="mb-3 text-muted-foreground text-sm">
              To maintain this project on OpenSource Together, we'll verify your
              access to the repository. You can claim ownership if:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm">
              <li>
                You're the <b>owner</b> of the repository (personal account)
              </li>
              <li>
                You're an <b>organization owner</b> (org repos)
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
