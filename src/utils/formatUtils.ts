export default function formatNumberShort(
  value: number,
  locale: string = "fi-FI"
): string {
  if (value >= 1_000_000) {
    return (
      (value / 1_000_000).toLocaleString(locale, {
        maximumFractionDigits: 2,
      }) + " M"
    );
  }

  if (value >= 1_000) {
    return (
      (value / 1_000).toLocaleString(locale, {
        maximumFractionDigits: 1,
      }) + " k"
    );
  }

  return value.toLocaleString(locale);
}