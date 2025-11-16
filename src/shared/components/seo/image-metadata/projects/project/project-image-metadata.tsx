import { HiStar } from "react-icons/hi2";
import { RiGitForkFill } from "react-icons/ri";
import { VscGitPullRequest, VscIssues } from "react-icons/vsc";

import { ImageMetadataBackground } from "@/shared/components/seo/image-metadata/commons/background/image-metadata-background";
import { ImageMetadataContent } from "@/shared/components/seo/image-metadata/commons/content/image-metadata-content";

interface ProjectImageMetadataProps {
  name: string;
  description?: string;
  imageUrl?: string | null;
  forksCount?: number | null;
  openIssuesCount?: number | null;
  pullRequestsCount?: number | null;
  starsCount?: number | null;
}

export function ProjectImageMetadata({
  name,
  description,
  imageUrl,
  forksCount,
  openIssuesCount,
  pullRequestsCount,
  starsCount,
}: ProjectImageMetadataProps) {
  const logoSize = 300;
  const summary = (() => {
    if (!description) {
      return "Discover contributors, highlight your roadmap, and grow your open-source project with the community.";
    }
    if (description.length <= 130) {
      return description;
    }
    return `${description.slice(0, 130)}...`;
  })();

  const stats = [
    { label: "Stars", value: starsCount, icon: HiStar },
    { label: "Forks", value: forksCount, icon: RiGitForkFill },
    { label: "Open issues", value: openIssuesCount, icon: VscIssues },
    {
      label: "Pull requests",
      value: pullRequestsCount,
      icon: VscGitPullRequest,
    },
  ].filter(
    (stat) =>
      typeof stat.value === "number" &&
      stat.value !== null &&
      stat.value !== undefined
  ) as Array<{
    label: string;
    value: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  const numberFormatter = new Intl.NumberFormat("en-US");

  return (
    <ImageMetadataBackground>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          position: "relative",
          paddingInline: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "100%",
            maxWidth: "640px",
          }}
        >
          <ImageMetadataContent title={name} description={summary} />
          {stats.length ? (
            <div
              style={{
                display: "flex",
                gap: "56px",
              }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "48px",
                        fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {numberFormatter.format(stat.value)}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "20px",
                        fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: "#737373",
                      }}
                    >
                      <Icon size={20} />
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        {imageUrl ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              borderRadius: "65px",
              overflow: "hidden",
              marginTop: "52px",
            }}
            aria-label={`${name} logo`}
          >
            <img
              src={imageUrl}
              alt={`${name} logo`}
              width={logoSize}
              height={logoSize}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : null}
      </div>
    </ImageMetadataBackground>
  );
}
