import { useMemo } from "react";

import { decodeBase64Safe } from "@/shared/lib/utils/decode-base-64";

interface DecodedFiles {
  readme?: string;
  contributionFile?: string;
  codeOfConduct?: string;
}

interface Project {
  repositoryDetails?: {
    readme?: string | null;
    contributionFile?: string | null;
    cocFile?: string | null;
  } | null;
}

/**
 * Hook to decode Base64 encoded files from project repository details
 * Centralizes the decoding logic and provides memoized results
 */
export function useDecodedFiles(project: Project | undefined): DecodedFiles {
  return useMemo(() => {
    if (!project?.repositoryDetails) {
      return {};
    }

    const { readme, contributionFile, cocFile } = project.repositoryDetails;

    return {
      readme: readme ? (decodeBase64Safe(readme) ?? readme) : undefined,
      contributionFile: contributionFile
        ? (decodeBase64Safe(contributionFile) ?? contributionFile)
        : undefined,
      codeOfConduct: cocFile
        ? (decodeBase64Safe(cocFile) ?? cocFile)
        : undefined,
    };
  }, [
    project?.repositoryDetails?.readme,
    project?.repositoryDetails?.contributionFile,
    project?.repositoryDetails?.cocFile,
  ]);
}
