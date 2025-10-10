import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

function getBackendUrl(): string | null {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "";

  if (envUrl) return envUrl.replace(/\/+$/, "");
  return null;
}

function buildTargetUrl(
  req: NextRequest,
  path: string[],
  backendBase: string
): URL {
  const joined = path.join("/");
  const url = new URL(`${backendBase}/${joined}`);
  // preserve query params
  for (const [key, value] of req.nextUrl.searchParams.entries()) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function proxy(method: string, req: NextRequest, context: RouteContext) {
  const backendBase = getBackendUrl();
  if (!backendBase) {
    return NextResponse.json(
      { error: "Backend URL not configured. Set NEXT_PUBLIC_API_URL." },
      { status: 500 }
    );
  }

  const params = await context.params;
  const targetUrl = buildTargetUrl(req, params.path || [], backendBase);

  const headers = new Headers(req.headers);
  // Forward cookies for session-based auth
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  // Drop next-specific headers that backend might not expect
  headers.delete("host");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");

  const init: RequestInit = {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : await req.arrayBuffer(),
    redirect: "manual",
  };

  const resp = await fetch(targetUrl, init);

  const respHeaders = new Headers(resp.headers);
  // Ensure cookies set by backend pass through
  const setCookie = respHeaders.get("set-cookie");
  const headersInit: Record<string, string> = {};
  respHeaders.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return; // handled separately
    headersInit[key] = value;
  });

  const response = new NextResponse(resp.body, {
    status: resp.status,
    headers: headersInit,
  });

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export async function GET(req: NextRequest, context: RouteContext) {
  return proxy("GET", req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return proxy("POST", req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return proxy("PUT", req, context);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return proxy("PATCH", req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxy("DELETE", req, context);
}

export async function HEAD(req: NextRequest, context: RouteContext) {
  return proxy("HEAD", req, context);
}

export async function OPTIONS(req: NextRequest, context: RouteContext) {
  return proxy("OPTIONS", req, context);
}
