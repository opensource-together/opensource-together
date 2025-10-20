import { ImageResponse } from "next/og";
import { ReactElement } from "react";

export async function Generator({ children }: { children: ReactElement }) {
  const responseOptions: Record<string, unknown> = {
    width: 1200,
    height: 630,
  };

  return new ImageResponse(children, responseOptions);
}
