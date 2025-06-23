"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { useProjectCreateStore } from "../../stores/project-create.store";

// Temporary schema for GitHub step-one
const githubStepOneSchema = z.object({
  repositoryUrl: z.string().url("URL de repository invalide"),
});

type GitHubStepOneFormData = z.infer<typeof githubStepOneSchema>;

export function StepOneForm() {
  const router = useRouter();
  const { selectRepository } = useProjectCreateStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GitHubStepOneFormData>({
    resolver: zodResolver(githubStepOneSchema),
    defaultValues: {
      repositoryUrl: "",
    },
  });

  const onSubmit = (data: GitHubStepOneFormData) => {
    // At the moment, we simulate a selected repository
    // Later, this will come from a GitHub API
    selectRepository({
      name: data.repositoryUrl.split("/").pop() || "repository",
      date: new Date().toISOString(),
    });

    router.push("/projects/create/github/step-two");
  };

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label>URL du repository GitHub</Label>
        <Input
          {...register("repositoryUrl")}
          placeholder="https://github.com/user/repo"
        />
        {errors.repositoryUrl && (
          <p className="mt-1 text-sm text-red-500">
            {errors.repositoryUrl.message}
          </p>
        )}
      </div>

      <Button
        size="lg"
        className="flex items-center justify-center"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Validation..." : "Continuer"}
      </Button>
    </form>
  );
}
