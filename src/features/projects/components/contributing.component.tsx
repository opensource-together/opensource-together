import { HiUsers } from "react-icons/hi2";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { EmptyState } from "@/shared/components/ui/empty-state";
import { readmePreviewMarkdownComponents } from "@/shared/components/ui/markdown-components";

interface ContributingComponentProps {
  contributionFile: string;
}

export default function ContributingComponent({
  contributionFile,
}: ContributingComponentProps) {
  return (
    <>
      {contributionFile ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={readmePreviewMarkdownComponents as Components}
        >
          {contributionFile}
        </ReactMarkdown>
      ) : (
        <EmptyState
          title="No CONTRIBUTING.md"
          description="This project does not have any contributing guidelines."
          icon={HiUsers}
          className="max-w-52"
        />
      )}
    </>
  );
}
