/**
 * Format large numbers into a short, human-readable format.
 * Examples:
 *  - 950       -> "950"
 *  - 1200      -> "1.2k"
 *  - 2000      -> "2k"
 *  - 15494     -> "15.5k"
 *  - 2_000_000 -> "2M"
 */
export function formatNumberShort(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  let formatted: number;
  let suffix = "";

  if (absValue >= 1_000_000) {
    formatted = absValue / 1_000_000;
    suffix = "M";
  } else if (absValue >= 1_000) {
    formatted = absValue / 1_000;
    suffix = "k";
  } else {
    return sign + absValue.toString();
  }

  // Supprime les .0 inutiles (ex: 2.0k → 2k)
  const display = formatted.toFixed(1).replace(/\.0$/, "");

  return `${sign}${display}${suffix}`;
}
