import { z } from "zod";

// ========================================
// URL WITH DOMAIN CHECK VALIDATION
// ========================================

export const urlWithDomainCheck = (
  allowedDomains: string[],
  errorMsg: string
) =>
  z
    .string()
    .trim()
    .transform((val) => {
      if (!val) return ""; // accept empty fields
      return val.startsWith("http://") || val.startsWith("https://")
        ? val
        : `https://${val}`;
    })
    .refine(
      (val) => {
        if (val === "") return true;

        try {
          const parsed = new URL(val);

          // The hostname must contain a dot (.)
          if (!parsed.hostname.includes(".")) return false;

          // If no specific domains, a valid URL is enough
          if (allowedDomains.length === 0) return true;

          return allowedDomains.some(
            (domain) =>
              parsed.hostname === domain ||
              parsed.hostname.endsWith(`.${domain}`)
          );
        } catch {
          return false;
        }
      },
      { message: errorMsg }
    )
    .optional()
    .or(z.literal(""));

// ========================================
// PREDEFINED DOMAIN VALIDATORS
// ========================================

// ========================================
// TYPE EXPORTS
// ========================================

export type UrlWithDomainCheck = z.infer<ReturnType<typeof urlWithDomainCheck>>;
