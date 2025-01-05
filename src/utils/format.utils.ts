export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export const formatBand = (band: string): string => {
  const [min, max] = band.split("-");

  if (
    !min ||
    (!max && max !== "∞") ||
    isNaN(Number(min)) ||
    (max !== "∞" && isNaN(Number(max)))
  ) {
    return band;
  }

  if (min === "0") return `${formatCurrency(Number(max))} or less`;
  if (max === "∞") return `More than ${formatCurrency(Number(min))}`;
  return `${formatCurrency(Number(min))} - ${formatCurrency(Number(max))}`;
};
