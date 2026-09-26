export interface FormatRupiahOptions {
  withDecimals?: boolean;
  showSign?: boolean;
}

export function formatRupiah(
  amount: number,
  options?: FormatRupiahOptions
): string {
  const { withDecimals = true, showSign = false } = options ?? {};

  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  const integerPart = Math.floor(absVal)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const decimalPart = withDecimals
    ? ',' + (absVal % 1).toFixed(2).slice(2)
    : '';

  const numStr = `${integerPart}${decimalPart}`;

  if (isNegative) {
    return `-Rp${numStr}`;
  }

  if (showSign && amount > 0) {
    return `+Rp${numStr}`;
  }

  return `Rp${numStr}`;
}
