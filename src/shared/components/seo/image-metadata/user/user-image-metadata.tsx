import { ImageMetadataBackground } from "../commons/background/image-metadata-background";
import { ImageMetadataContent } from "../commons/content/image-metadata-content";

export interface UserImageMetadataProps {
  name: string;
  description: string;
  imageUrl: string;
}

export function UserImageMetadata({
  name,
  description,
  imageUrl,
}: UserImageMetadataProps) {
  const logo =
    imageUrl ||
    `https://ui-avatars.com/ap  /?name=${encodeURIComponent(
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
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              borderRadius: "9999px",
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(15, 23, 42, 0.08)",
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
