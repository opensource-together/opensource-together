"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import Icon from "@/shared/components/ui/icon";
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
      <div className="mb-9 w-full rounded-xl border border-black/5 px-6 pt-7 pb-8">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Repository Name</Label>
          </div>
          <div className="mt-2 font-normal text-black/50">
            {formData.selectedRepository?.name}
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-lg">Description</Label>
            </div>
          </div>
          <div className="mb-3 line-clamp-5 h-[100px] text-sm leading-6 text-black/50">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {formData.selectedRepository?.description ||
                "No description available. You can add one in the next step."}
            </ReactMarkdown>
          </div>
        </div>
        <div className="my-4 h-px border-t-2 border-black/5" />
        <div>
          <div className="mb-1 flex items-center gap-1">
            <Label className="text-lg">Repository Link</Label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Icon name="link" variant="gray" size="sm" />
            <span className="line-clamp-1 text-sm font-normal break-all text-black/50">
              {formData.repoUrl || formData.selectedRepository?.html_url}
            </span>
          </div>
        </div>
      </div>

      <FormNavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        nextType="button"
      />
    </div>
  );
}
