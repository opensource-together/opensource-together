export const SESSION_COOKIE = "better-auth.session_token";
export const SIGNED_OUT_COOKIE = "mock_signed_out";
export const MOCK_SESSION_TOKEN = "mock-session-token";

function readCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1];
}

function writeCookie(value: string): void {
  // biome-ignore lint/suspicious/noDocumentCookie: this dev-only mock must exercise Next middleware cookies.
  document.cookie = value;
}

/* ------------------------------- server side ------------------------------ */

export function isSignedOut(request: Request): boolean {
  return (
    readCookie(request.headers.get("cookie") ?? "", SIGNED_OUT_COOKIE) === "1"
  );
}

export function isAuthenticated(request: Request): boolean {
  return !isSignedOut(request);
}

/* ------------------------------- browser side ----------------------------- */

export const mockSession = {
  isAuthenticated(): boolean {
    if (typeof document === "undefined") return true;
    return readCookie(document.cookie, SIGNED_OUT_COOKIE) !== "1";
  },

  signIn() {
    writeCookie(`${SIGNED_OUT_COOKIE}=; path=/; max-age=0`);
    writeCookie(
      `${SESSION_COOKIE}=${MOCK_SESSION_TOKEN}; path=/; max-age=31536000; SameSite=Lax`
    );

    const redirectTo = new URLSearchParams(window.location.search).get(
      "redirectTo"
    );
    if (redirectTo) {
      const target = new URL(redirectTo, window.location.origin);
      if (target.origin === window.location.origin) {
        window.location.replace(
          `${target.pathname}${target.search}${target.hash}`
        );
        return;
      }
    }

    if (window.location.pathname.startsWith("/auth/")) {
      window.location.replace("/");
      return;
    }

    window.location.reload();
  },

  signOut() {
    writeCookie(
      `${SIGNED_OUT_COOKIE}=1; path=/; max-age=31536000; SameSite=Lax`
    );
    writeCookie(`${SESSION_COOKIE}=; path=/; max-age=0`);
    window.location.reload();
  },

  toggle() {
    if (mockSession.isAuthenticated()) mockSession.signOut();
    else mockSession.signIn();
  },
};
