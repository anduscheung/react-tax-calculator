import { calculateTaxes, TaxCalculation } from "./tax.utils";
import Logger from "./logger";

jest.mock("./logger");

describe("tax.utils", () => {
  describe("calculateTaxes", () => {
    const taxBrackets = [
      { min: 0, max: 50000, rate: 0.1 },
      { min: 50000, max: 100000, rate: 0.2 },
      { min: 100000, rate: 0.3 },
    ];

    it("should calculate taxes correctly for a valid income", () => {
      const result = calculateTaxes("75000", taxBrackets);
      expect(result).toEqual({
        totalTax: 10000,
        taxesPerBand: [
          { band: "0-50000", tax: 5000, rate: 0.1 },
          { band: "50000-100000", tax: 5000, rate: 0.2 },
          { band: "100000-∞", tax: 0, rate: 0.3 },
        ],
        effectiveRate: 10000 / 75000,
      });
    });

    it("should return 0 for totalTax and effectiveRate if income is not a valid number", () => {
      const result = calculateTaxes("invalid", taxBrackets);
      expect(result).toEqual({
        totalTax: 0,
        taxesPerBand: [
          { band: "0-50000", tax: 0, rate: 0.1 },
          { band: "50000-100000", tax: 0, rate: 0.2 },
          { band: "100000-∞", tax: 0, rate: 0.3 },
        ],
        effectiveRate: 0,
      });
      expect(Logger.warn).toHaveBeenCalledWith(
        "Income is not a valid number, returning 0 for taxes and rate",
        { income: "invalid" }
      );
    });

    it("should calculate no taxes for an income of 0", () => {
      const result = calculateTaxes("0", taxBrackets);
      expect(result).toEqual({
        totalTax: 0,
        taxesPerBand: [
          { band: "0-50000", tax: 0, rate: 0.1 },
          { band: "50000-100000", tax: 0, rate: 0.2 },
          { band: "100000-∞", tax: 0, rate: 0.3 },
        ],
        effectiveRate: 0,
      });
    });

    it("should calculate taxes correctly for an income that exceeds all brackets", () => {
      const result = calculateTaxes("150000", taxBrackets);
      expect(result).toEqual({
        totalTax: 30000,
        taxesPerBand: [
          { band: "0-50000", tax: 5000, rate: 0.1 },
          { band: "50000-100000", tax: 10000, rate: 0.2 },
          { band: "100000-∞", tax: 15000, rate: 0.3 },
        ],
        effectiveRate: 30000 / 150000,
      });
    });

    it("should calculate taxes correctly when income is within the first bracket", () => {
      const result = calculateTaxes("25000", taxBrackets);
      expect(result).toEqual({
        totalTax: 2500,
        taxesPerBand: [
          { band: "0-50000", tax: 2500, rate: 0.1 },
          { band: "50000-100000", tax: 0, rate: 0.2 },
          { band: "100000-∞", tax: 0, rate: 0.3 },
        ],
        effectiveRate: 2500 / 25000,
      });
    });
  });
});
