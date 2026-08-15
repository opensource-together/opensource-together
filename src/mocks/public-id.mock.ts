export function mockPublicId(prefix: string, seed: number): string {
  const hex = seed.toString(16).padStart(32, "0").slice(-32);
  return `${prefix}_${hex}`;
}
