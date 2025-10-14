"use client";

import { memo, useMemo } from "react";

import { Avatar } from "@/shared/components/ui/avatar";

const ProjectImages = memo(({ imageUrls }: { imageUrls: string[] }) => {
  if (imageUrls.length === 0) return null;

  return (
    <div className="flex gap-1">
      {imageUrls.length === 1 ? (
        <div className="w-full">
          <div className="relative h-[207px] overflow-hidden rounded-md">
            <img
              src={imageUrls[0]}
              alt="Project screenshot"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="w-3/4">
            <div className="relative h-[207px] w-full overflow-hidden rounded-md">
              <img
                src={imageUrls[0]}
                alt="Project screenshot 1"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="w-1/4 space-y-1">
            {imageUrls.slice(1, 4).map((url, idx) => (
              <div
                key={idx}
                className="relative h-[67px] w-full overflow-hidden rounded-md"
              >
                <img
                  src={url}
                  alt={`Project screenshot ${idx + 2}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

ProjectImages.displayName = "ProjectImages";

interface ProjectDescribePreviewProps {
  title?: string;
  description?: string;
  logoUrl?: string | File;
  imageUrls?: string[];
}

export function ProjectDescribePreview({
  title = "Project Name",
  description = "Project description will appear here...",
  logoUrl,
  imageUrls = [],
}: ProjectDescribePreviewProps) {
  const logoPreview = useMemo(() => {
    return logoUrl instanceof File ? URL.createObjectURL(logoUrl) : logoUrl;
  }, [logoUrl]);

  return (
    <div className="bg-accent flex flex-col rounded-2xl p-8">
      <div className="mb-4 flex items-center gap-4">
        <Avatar
          src={logoPreview}
          name={title}
          alt={title}
          size="xl"
          shape="rounded"
        />
        <h1 className="text-xl font-medium">{title}</h1>
      </div>

      <p className="mb-6 text-sm">{description}</p>

      <ProjectImages imageUrls={imageUrls} />
    </div>
  );
}
