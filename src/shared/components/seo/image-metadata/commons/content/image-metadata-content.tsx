import { OstMetadataLogo } from "../logo/ost-metadata-logo";

interface ContentProps {
  title: string;
  subtitle?: string;
  description: string;
}

export function ImageMetadataContent({
  title,
  subtitle,
  description,
}: ContentProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "630px",
        gap: "20px",
        zIndex: 1,
      }}
    >
      <OstMetadataLogo />

      <div
        style={{
          fontSize: "64px",
          fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
          fontWeight: 500,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          lineClamp: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            fontSize: "28px",
            fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
            fontWeight: 500,
            color: "#475569",
            letterSpacing: "-0.01em",
          }}
        >
          {subtitle}
        </div>
      ) : null}

      <div
        style={{
          fontSize: "20px",
          fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
          fontWeight: 400,
          lineHeight: 1.35,
          color: "#737373",
          letterSpacing: "-0.01em",
        }}
      >
        {description}
      </div>
    </div>
  );
}
