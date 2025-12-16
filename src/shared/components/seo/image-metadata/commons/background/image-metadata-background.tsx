import type { PropsWithChildren } from "react";

export function ImageMetadataBackground({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "36px",
            borderRadius: "40px",
            border: "1px solid rgba(148, 163, 184, 0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 100% at 15% 15%, rgba(81, 162, 255, 0.18) 0%, rgba(81, 162, 255, 0) 65%), radial-gradient(120% 100% at 85% 85%, rgba(30, 41, 59, 0.12) 0%, rgba(30, 41, 59, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0",
            borderRadius: "48px",
            boxShadow: "0 60px 120px rgba(15, 23, 42, 0.08)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
