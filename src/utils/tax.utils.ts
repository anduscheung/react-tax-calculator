import { isNumberString } from "./form.utils";
import Logger from "./logger";

export type TaxCalculation = {
  totalTax: number;
  taxesPerBand: { band: string; tax: number; rate: number }[];
  effectiveRate: number;
};

export const calculateTaxes = (
  income: string,
  taxBrackets: { min: number; max?: number; rate: number }[]
): TaxCalculation => {
  if (!isNumberString(income)) {
    Logger.warn(
      "Income is not a valid number, returning 0 for taxes and rate",
      { income }
    );
    return {
      totalTax: 0,
      taxesPerBand: taxBrackets.map((bracket) => ({
        band: `${bracket.min}-${bracket.max ?? "∞"}`,
        tax: 0,
        rate: bracket.rate,
      })),
      effectiveRate: 0,
    };
  }

  let totalTax = 0;
  const taxesPerBand: { band: string; tax: number; rate: number }[] = [];

  const taxedNum = Number(income);
  taxBrackets.forEach((bracket) => {
    const taxableIncome = Math.max(
      0,
      Math.min(taxedNum, bracket.max ?? taxedNum) - bracket.min
    );

    const taxForBand = taxableIncome * bracket.rate;

    totalTax += taxForBand;

    taxesPerBand.push({
      band: `${bracket.min}-${bracket.max ?? "∞"}`,
      tax: taxForBand > 0 ? taxForBand : 0,
      rate: bracket.rate,
    });
  });

  const effectiveRate = taxedNum === 0 ? 0 : totalTax / taxedNum;

  return {
    totalTax,
    taxesPerBand,
    effectiveRate,
  };
};
