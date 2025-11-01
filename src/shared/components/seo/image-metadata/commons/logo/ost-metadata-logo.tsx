const FALLBACK_LOGO_HOST = process.env.NEXT_PUBLIC_FRONTEND_URL!;

export function OstMetadataLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "32px",
        color: "#0f172a",
      }}
    >
      <img
        src={`${FALLBACK_LOGO_HOST.replace(/\/$/, "")}/ostogether-logo.png`}
        alt="OpenSource Together logo"
        style={{
          width: "85%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
