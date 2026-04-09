export function parseTiledValue(raw: any): string {
  const str = String(raw ?? "");
  return str.includes("Value:")
    ? str.split("Value:")[1].trim()
    : str;
}