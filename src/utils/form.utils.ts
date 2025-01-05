export const removeLeadingZero = (value: string): string => {
  // Negative numbers
  if (value.startsWith("-")) {
    return `-${value.slice(1).replace(/^0+/, "") || "0"}`;
  }
  // Positive numbers
  return value.replace(/^0+/, "") || "0";
};
export const addZeroIfNothing = (value: string): string => {
  return value === "" ? "0" : value;
};

export const isNumberString = (value: string): boolean => {
  return !isNaN(Number(value));
};
