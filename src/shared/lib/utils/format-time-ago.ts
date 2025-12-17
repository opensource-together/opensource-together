/**
 * Format a given date into a human-readable "time ago" string in full English.
 * Example: "3  ago", "2 days ago", "5m ago"
 */
export function formatTimeAgo(dateInput: string | number | Date): string {
  if (!dateInput) return "N/A";

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions = [
    { amount: 60, name: "seconds", short: "s" },
    { amount: 60, name: "minutes", short: "m" },
    { amount: 24, name: "hours", short: "h" },
    { amount: 7, name: "days", short: "d" },
    { amount: 4.34524, name: "weeks", short: "w" },
    { amount: 12, name: "months", short: "mo" },
    { amount: Number.POSITIVE_INFINITY, name: "years", short: "y" },
  ];

  let duration = diffInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      const rounded = Math.round(duration);

      const short = `${Math.abs(rounded)}${division.short} ago`;

      const full = rtf.format(
        rounded,
        division.name as Intl.RelativeTimeFormatUnit
      );

      return Math.abs(duration) < 60 ? short : full;
    }
    duration /= division.amount;
  }

  return "some time ago";
}
