import {
  removeLeadingZero,
  addZeroIfNothing,
  isNumberString,
} from "./form.utils";

describe("form.utils", () => {
  describe("removeLeadingZero", () => {
    it("should remove leading zeros from a positive number string", () => {
      expect(removeLeadingZero("00123")).toBe("123");
      expect(removeLeadingZero("000")).toBe("0");
      expect(removeLeadingZero("0")).toBe("0");
    });

    it("should remove leading zeros from a negative number string", () => {
      expect(removeLeadingZero("-00123")).toBe("-123");
      expect(removeLeadingZero("-000")).toBe("-0");
      expect(removeLeadingZero("-0")).toBe("-0");
    });

    it("should return '0' if the input is an empty string after removal", () => {
      expect(removeLeadingZero("")).toBe("0");
    });

    it("should not modify strings without leading zeros", () => {
      expect(removeLeadingZero("123")).toBe("123");
      expect(removeLeadingZero("-123")).toBe("-123");
    });
  });

  describe("addZeroIfNothing", () => {
    it("should add '0' if the input is an empty string", () => {
      expect(addZeroIfNothing("")).toBe("0");
    });

    it("should return the input unchanged if it is not an empty string", () => {
      expect(addZeroIfNothing("123")).toBe("123");
      expect(addZeroIfNothing("0")).toBe("0");
    });
  });

  describe("isNumberString", () => {
    it("should return true for valid number strings", () => {
      expect(isNumberString("123")).toBe(true);
      expect(isNumberString("-123")).toBe(true);
      expect(isNumberString("0")).toBe(true);
      expect(isNumberString("123.45")).toBe(true);
      expect(isNumberString("-123.45")).toBe(true);
      expect(isNumberString("")).toBe(true);
      expect(isNumberString(" ")).toBe(true);
    });

    it("should return false for invalid number strings", () => {
      expect(isNumberString("123abc")).toBe(false);
      expect(isNumberString("abc")).toBe(false);
    });
  });
});
