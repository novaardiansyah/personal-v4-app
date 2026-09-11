export interface FormatRupiahOptions {
  /**
   * Whether to include decimal digits (,00). Default is true.
   */
  withDecimals?: boolean;
  /**
   * Whether to display a positive '+' sign for positive numbers. Default is false.
   */
  showSign?: boolean;
}

/**
 * Format a number into standard Indonesian Rupiah format (e.g. Rp1.000,00, -Rp150.000,00, +Rp25.000,00)
 */
export function formatRupiah(
  amount: number,
  options?: FormatRupiahOptions
): string {
  const { withDecimals = true, showSign = false } = options ?? {};

  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  // Pemisah ribuan dengan titik
  const integerPart = Math.floor(absVal)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Desimal dengan koma (default 2 digit desimal ,00)
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

