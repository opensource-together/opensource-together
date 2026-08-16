import { API_BASE_URL } from "@/config/config";

export interface ApiResponse<T> {
  data: T;
  timestamp?: string;
}

export interface ApiRequestContext {
  headers?: HeadersInit;
  signal?: AbortSignal | null;
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  baseUrl?: string;
  body?: BodyInit | null;
  json?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getApiErrorMessage(body: unknown, response: Response): string {
  if (typeof body === "string" && body) return body;

  if (body && typeof body === "object") {
    const errorBody = body as {
      error?: unknown;
      errors?: unknown;
      message?: unknown;
    };
    if (typeof errorBody.message === "string" && errorBody.message) {
      return errorBody.message;
    }
    if (typeof errorBody.error === "string" && errorBody.error) {
      return errorBody.error;
    }
    if (Array.isArray(errorBody.errors)) {
      const validationError = errorBody.errors.find(
        (item): item is { message: string } =>
          !!item &&
          typeof item === "object" &&
          "message" in item &&
          typeof item.message === "string"
      );
      if (validationError) return validationError.message;
    }
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    baseUrl = API_BASE_URL,
    body,
    headers: initialHeaders,
    json,
    ...init
  } = options;
  const headers = new Headers(initialHeaders);
  const hasJsonBody = json !== undefined;

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    ...init,
    headers,
    body: hasJsonBody ? JSON.stringify(json) : body,
  });
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      getApiErrorMessage(responseBody, response),
      response.status,
      responseBody
    );
  }

  return responseBody as T;
}

export async function apiData<T>(
  path: string,
  options?: ApiRequestOptions
): Promise<T> {
  const response = await apiRequest<unknown>(path, options);

  if (!response || typeof response !== "object" || !("data" in response)) {
    throw new Error(`Invalid API response for ${path}: missing data`);
  }

  return (response as ApiResponse<T>).data;
}

export function withQueryParams<T extends object>(
  path: string,
  params?: T
): string {
  if (!params) return path;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(
      key,
      Array.isArray(value) ? value.join(",") : String(value)
    );
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}
