import { PercentageString } from "@utils/variables/types/unit-types.variables";

/**
 * Generates a random number within a specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {boolean} includeMin - Whether to include the minimum value in the range.
 * @param {boolean} includeMax - Whether to include the maximum value in the range.
 *
 * @returns {number} A random number within the specified range.
 */
export function getRandomNumber(
  min: number = 0,
  max: number = 1,
  includeMin: boolean = true,
  includeMax: boolean = true
): number {
  const hasInvalidArgument: boolean = min > max;
  if (hasInvalidArgument) {
    throw new Error(
      `Unexpected error occurred in the passed argument values: min > max`
    );
  }

  const mustIncludeBoth: boolean = includeMin && includeMax;

  const mustIncludeOnlyMin: boolean = includeMin && !includeMax;

  const mustIncludeOnlyMax: boolean = !includeMin && includeMax;

  if (mustIncludeBoth) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else if (mustIncludeOnlyMin) {
    return Math.floor(Math.random() * (max - min)) + min;
  } else if (mustIncludeOnlyMax) {
    return Math.floor(Math.random() * (max - min)) + min + 1;
  } else {
    //We don't include either
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
  }
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} number - The number to round.
 * @param {number} [float=3] - The number of decimal places to round to (default is 3).
 *
 * @throws {TypeError} Throws a TypeError if either argument is not a valid number.
 * @returns {number} The rounded number.
 */
export function roundToFloat(number: number, float: number = 3): number {
  const hasInvalidArgumentTypes: boolean =
    typeof number !== "number" || typeof float !== "number";
  if (hasInvalidArgumentTypes) {
    throw new TypeError(`Expected both arguments to be of type number, instead got:
 Number: ${number} of type ${typeof number}
 Float: ${float} of type ${typeof float}
 `);
  }

  const { isNaN } = Number;
  const areNotValidNumbers: boolean = isNaN(number) || isNaN(float);
  if (areNotValidNumbers) {
    throw new TypeError(`Got NaN number values:
Number: ${number} of type ${typeof number}
Float: ${float} of type ${typeof float}
    `);
  }

  const nthPowerOfTen: number = 10 ** float;

  return Math.trunc(number * nthPowerOfTen) / nthPowerOfTen;
}

/**
 * Converts a percentage string to a numeric value **between 0 and 1**
 *
 * @param {PercentageString} percentage - The percentage string to convert (e.g., "50%").
 *
 * @throws {Error} If the input is not a valid percentage.
 *
 * @returns {number} The numeric value represented by the percentage string
 */
export function stringPercentageToNumber(percentage: PercentageString): number {
  const stringValue = percentage as string;

  const numericValue: number = Number(stringValue.replace("%", ""));

  const { isNaN } = Number;
  const isNotANumber: boolean = isNaN(numericValue);
  if (isNotANumber) {
    throw new Error(`Invalid percentage: ${percentage}`);
  }

  return numericValue / 100;
}

/**
 * Converts a hexadecimal string to its decimal equivalent.
 * @param {string} hexadecimal - The hexadecimal string to convert.
 * @returns {number} The decimal representation of the hexadecimal value.
 */
export function hexadecimalToDecimal(hexadecimal: string): number {
  return Number(`0x${hexadecimal}`);
}

/**
 * Converts a decimal value to its hexadecimal equivalent.
 * @param {number} decimal - The decimal value to convert.
 * @returns {string} The hexadecimal representation of the decimal value.
 */
export function decimalToHexadecimal(decimal: number): string {
  return decimal.toString(16);
}

/**
 * Converts a percentage value to its hexadecimal representation as an alpha channel.
 * @param {number | string} percentage - The percentage value to convert.
 * @returns {string} - The hexadecimal alpha channel representation.
 * @throws {Error} If the input is not a valid percentage (e.g., "-50%", "0.5%", "100%%").
 */
export function percentageToHex(percentage: number | string): string {
  // If the input is a string, check if it's a valid percentage
  const percentageIsAString: boolean = typeof percentage === "string";
  if (percentageIsAString) {
    percentage = percentage as string;

    const percentageRegex: RegExp = /^(-?\d+(\.\d+)?%)$/;

    const isNotAPercentage: boolean = !percentageRegex.test(percentage);
    if (isNotAPercentage) {
      throw new Error(`Invalid string percentage: ${percentage}`);
    }

    percentage = Number(percentage.replace("%", ""));
  }

  percentage = percentage as number;
  // Ensure the input is between 0 and 100%
  const underflows: boolean = percentage < 0;
  if (underflows) {
    percentage = 0;
  }

  const overflows: boolean = percentage > 100;
  if (overflows) {
    percentage = 100;
  }

  // Convert the percentage to a decimal value between 0 and 1
  const decimalValue = percentage / 100;

  // Multiply by 255 and round to the nearest integer
  const alphaValue = Math.round(decimalValue * 255);

  // Convert the alpha value to its hexadecimal representation
  const hexAlpha = alphaValue.toString(16).toUpperCase();

  // Ensure the result is always two digits
  return hexAlpha.length === 1 ? `0${hexAlpha}` : hexAlpha;
}

/**
 * Calculates the contrast ratio between two colors.
 *
 * @param {string} color1 - The first color in hexadecimal format (e.g., '#RRGGBB').
 * @param {string} color2 - The second color in hexadecimal format (e.g., '#RRGGBB').
 * @returns {{
 *   contrastRatio: number,
 *   respectsW3CGuidelines: boolean
 * }} An object containing the contrast ratio and whether it respects W3C guidelines for contrast ratio for text
 */
export function calculateContrast(
  color1: string,
  color2: string
): {
  contrastRatio: number;
  respectsW3CGuidelines: boolean;
} {
  // Convert colors to RGB arrays [R, G, B]
  const rgbColor1: number[] = [
    hexadecimalToDecimal(color1.slice(1, 3)),
    hexadecimalToDecimal(color1.slice(3, 5)),
    hexadecimalToDecimal(color1.slice(5, 7)),
  ];

  const rgbColor2: number[] = [
    hexadecimalToDecimal(color2.slice(1, 3)),
    hexadecimalToDecimal(color2.slice(3, 5)),
    hexadecimalToDecimal(color2.slice(5, 7)),
  ];

  const luminance1: number = getRelativeLuminance(rgbColor1);
  const luminance2: number = getRelativeLuminance(rgbColor2);

  let contrastRatio: number =
    luminance1 > luminance2
      ? (luminance1 + 0.05) / (luminance2 + 0.05)
      : (luminance2 + 0.05) / (luminance1 + 0.05);

  contrastRatio = roundToFloat(contrastRatio, 2);

  return {
    contrastRatio,
    respectsW3CGuidelines: contrastRatio >= 4.5,
  };
}
/**
 * Helper function to calculate relative luminance.
 *
 * @param {number[]} color - An array representing the color in [R, G, B] format (each component in [0, 255]).
 * @returns {number} The relative luminance.
 */
export function getRelativeLuminance(color: number[]): number {
  const [R, G, B] = color.map((component) => {
    component /= 255; // Normalize to [0, 1] range
    return component <= 0.03928
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
