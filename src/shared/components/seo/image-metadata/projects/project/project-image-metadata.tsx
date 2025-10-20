import { ImageMetadataBackground } from "@/shared/components/seo/image-metadata/commons/background/image-metadata-background";
import { ImageMetadataContent } from "@/shared/components/seo/image-metadata/commons/content/image-metadata-content";

interface ProjectImageMetadataProps {
  name: string;
  description?: string;
  imageUrl?: string | null;
}

export function ProjectImageMetadata({
  name,
  description,
  imageUrl,
}: ProjectImageMetadataProps) {
  const logo =
    imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=f8fafc&color=0f172a&bold=true`;
  const summary = (() => {
    if (!description) {
      return "Discover contributors, highlight your roadmap, and grow your open-source project with the community.";
    }
    if (description.length <= 130) {
      return description;
    }
    return `${description.slice(0, 130)}...`;
  })();
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
        <ImageMetadataContent
          title={name}
          // subtitle="OpenSource Together"
          description={summary}
        />
        {logo ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "300px",
              borderRadius: "40px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <img
              src={logo}
              alt={`${name} logo`}
              width="300"
              height="300"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                backgroundColor: "#f8fafc",
              }}
            />
          </div>
        ) : null}
      </div>
    </ImageMetadataBackground>
  );
}
