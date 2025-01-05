import { formatCurrency, formatPercentage, formatBand } from "./format.utils";

describe("format.utils", () => {
  describe("formatCurrency", () => {
    it("should format a positive number as currency with commas", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format a negative number as currency with commas", () => {
      expect(formatCurrency(-1234.56)).toBe("$-1,234.56");
    });

    it("should format a whole number as currency with two decimal places and commas", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
    });

    it("should format zero as currency", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should format large numbers with commas and two decimal places", () => {
      expect(formatCurrency(123456789.01)).toBe("$123,456,789.01");
    });

    it("should round the number to two decimal places", () => {
      expect(formatCurrency(1234.567)).toBe("$1,234.57");
    });
  });

  describe("formatPercentage", () => {
    it("should format a positive rate as a percentage", () => {
      expect(formatPercentage(0.1234)).toBe("12.34%");
    });

    it("should format a negative rate as a percentage", () => {
      expect(formatPercentage(-0.1234)).toBe("-12.34%");
    });

    it("should format a whole number rate as a percentage", () => {
      expect(formatPercentage(1)).toBe("100.00%");
    });

    it("should format zero rate as percentage", () => {
      expect(formatPercentage(0)).toBe("0.00%");
    });

    it("should round the percentage to two decimal places", () => {
      expect(formatPercentage(0.123456)).toBe("12.35%");
    });
  });
});

describe("formatBand", () => {
  it("should format the band as 'max or less' if min is 0", () => {
    expect(formatBand("0-5000")).toBe("$5,000.00 or less");
  });

  it("should format the band as 'More than min' if max is '∞'", () => {
    expect(formatBand("500-∞")).toBe("More than $500.00");
  });

  it("should format the band as 'min - max' if both min and max are valid", () => {
    expect(formatBand("500-1000")).toBe("$500.00 - $1,000.00");
  });

  it("should return the original band for malformed input", () => {
    expect(formatBand("500-")).toBe("500-");
    expect(formatBand("-1000")).toBe("-1000");
    expect(formatBand("")).toBe("");
  });
});
