/**
 * Parses a number or string and converts it into a numeric value.
 * Handles different number formats with commas, periods, and spaces.
 * Returns 0 for invalid inputs.
 *
 * @param {number | string} value - The input value to parse.
 * @returns {number} - The parsed numeric value or 0 if parsing fails.
 */
function parseNumber(value: number | string): number {
  // Return the value directly if it's already a number
  if (typeof value === "number") {
    return value;
  }

  // If the value is not a string, return 0 as it's invalid
  if (typeof value !== "string") {
    return 0;
  }

  // Remove unnecessary characters (anything other than digits, commas, periods, and hyphens)
  const cleanedValue = value.trim().replace(/[^\d.,-]/g, "");

  // Handle cases where both commas and periods exist in the string
  if (cleanedValue.includes(",") && cleanedValue.includes(".")) {
    // If the comma appears after the period, assume the comma is the decimal separator
    if (cleanedValue.indexOf(",") > cleanedValue.indexOf(".")) {
      const normalizedValue = cleanedValue
        .replace(/\./g, "") // Remove all periods
        .replace(/,/g, "."); // Replace all commas with periods
      return parseFloat(normalizedValue); // Parse the normalized value as a float
    }
  }

  // If the string ends with a comma followed by 1-2 digits, treat it as a decimal
  const normalizedValue = cleanedValue.replace(/,(\d{1,2})$/, ".$1");

  // Remove any remaining commas from the string
  const finalValue = normalizedValue.replace(/,/g, "");

  // Convert the cleaned and normalized string into a float
  const parsedNumber = parseFloat(finalValue);

  // Return the parsed number, or 0 if parsing fails
  return isNaN(parsedNumber) ? 0 : parsedNumber;
}

export default parseNumber;
