import { ImageMetadataBackground } from "@/shared/components/seo/image-metadata/commons/background/image-metadata-background";
import { ImageMetadataContent } from "@/shared/components/seo/image-metadata/commons/content/image-metadata-content";

interface ProjectImageMetadataProps {
  name: string;
  description?: string;
  imageUrl?: string | null;
  forksCount?: number | null;
  openIssuesCount?: number | null;
  pullRequestsCount?: number | null;
}

export function ProjectImageMetadata({
  name,
  description,
  imageUrl,
  forksCount,
  openIssuesCount,
  pullRequestsCount,
}: ProjectImageMetadataProps) {
  const logo =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=f8fafc&color=0f172a&bold=true`;
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
    { label: "Forks", value: forksCount },
    { label: "Open issues", value: openIssuesCount },
    { label: "Pull requests", value: pullRequestsCount },
  ].filter(
    (stat) =>
      typeof stat.value === "number" &&
      stat.value !== null &&
      stat.value !== undefined
  ) as Array<{ label: string; value: number }>;
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
          paddingTop: "48px",
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
                gap: "32px",
                marginTop: "48px",
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "40px",
                      fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {numberFormatter.format(stat.value)}
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "#475569",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {logo ? (
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
              background: "#ffffff",
              backgroundColor: "#f8fafc",
            }}
            aria-label={`${name} logo`}
          >
            <img
              src={logo}
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
