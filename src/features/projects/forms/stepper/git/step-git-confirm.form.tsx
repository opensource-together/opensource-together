"use client";

import { useRouter } from "next/navigation";
import { HiLink } from "react-icons/hi2";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Label } from "@/shared/components/ui/label";

import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  provider,
  useProjectCreateStore,
} from "../../../stores/project-create.store";

interface StepGitConfirmFormProps {
  provider: provider;
}

export default function StepGitConfirmForm({
  provider,
}: StepGitConfirmFormProps) {
  const router = useRouter();
  const { formData } = useProjectCreateStore();

  const handlePrevious = () => {
    router.push(`/projects/create/${provider}/import`);
  };

  const handleNext = () => {
    router.push("/projects/create/describe");
  };

  return (
    <div className="w-full">
      <div className="border-muted-black-stroke mb-9 w-full rounded-xl border px-6 pt-7 pb-8">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Repository Name</Label>
          </div>
          <div className="text-muted-foreground mt-2 font-normal">
            {formData.selectedRepository?.name}
          </div>
        </div>
        <div className="border-muted-black-stroke my-4 h-px border-t-2" />
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-lg">Description</Label>
            </div>
          </div>
          <div className="text-muted-foreground mb-3 line-clamp-5 h-[100px] text-sm leading-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {formData.selectedRepository?.description ||
                "No description available. You can add one in the next step."}
            </ReactMarkdown>
          </div>
        </div>
        <div className="border-muted-black-stroke my-4 h-px border-t-2" />
        <div>
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Repository Link</Label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <HiLink className="text-muted-foreground size-3.5" />
            <span className="text-muted-foreground line-clamp-1 text-sm font-normal break-all">
              {formData.repoUrl || formData.selectedRepository?.html_url}
            </span>
          </div>
        </div>
      </div>

      <FormNavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextType="button"
        nextLabel="Confirm"
      />
    </div>
  );
}
