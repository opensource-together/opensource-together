import "server-only";

import { headers } from "next/headers";

import type { ApiRequestContext } from "./api-client";

export async function getServerApiContext(): Promise<ApiRequestContext> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get("cookie");

  return cookie ? { headers: { cookie } } : {};
}
