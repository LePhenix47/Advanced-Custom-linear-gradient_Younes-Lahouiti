import { hexadecimalToDecimal, roundToFloat } from "./number.helpers";

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - The angle in degrees to convert.
 *
 * @returns {number} The angle in radians.
 *
 * @throws {TypeError} If `degrees` is not a valid number or the result is NaN.
 *
 */
export function degreesToRadians(degrees: number): number {
  const isInvalidType: boolean = typeof degrees !== "number";
  const { isNaN } = Number;
  const isInputNaN: boolean = isNaN(degrees);

  const hasInvalidArguments: boolean = isInvalidType || isInputNaN;

  if (hasInvalidArguments) {
    const errorMessage: string = isInvalidType
      ? `Expected 'degrees' to be a valid number, but got: ${degrees}`
      : `Conversion to radians will result in NaN for degrees: ${degrees}`;
    throw new TypeError(errorMessage);
  }

  const radians: number = (degrees * Math.PI) / 180;

  return roundToFloat(radians, 3);
}

/**
 * Converts radians to degrees.
 *
 * @param {number} radians - The angle in radians to convert.
 *
 * @returns {number} The angle in degrees.
 *
 * @throws {TypeError} If `radians` is not a valid number or the result is NaN.
 *
 */
export function radiansToDegrees(radians: number): number {
  const isInvalidType: boolean = typeof radians !== "number";
  const { isNaN } = Number;
  const isInputNaN: boolean = isNaN(radians);

  const hasInvalidArguments: boolean = isInvalidType || isInputNaN;

  if (hasInvalidArguments) {
    const errorMessage: string = isInvalidType
      ? `Expected 'radians' to be a valid number, but got: ${radians}`
      : `Conversion to degrees will result in NaN for radians: ${radians}`;
    throw new TypeError(errorMessage);
  }

  const degrees: number = (radians * 180) / Math.PI;

  return roundToFloat(degrees, 3);
}

type VectorCoordinates = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
/**
 * Calculates coordinates (x1, y1, x2, y2) between 0 and 1 from a given radian angle.
 *
 * @param {number} rad - The radian angle to calculate coordinates from.
 *
 * @returns {VectorCoordinates} An object containing x1, y1, x2, and y2 coordinates.
 *
 * @throws {TypeError} If `rad` is not a valid number or the result is NaN.
 *
 */
export function calculateCoordsFromRadian(rad: number): VectorCoordinates {
  const isInvalidType: boolean = typeof rad !== "number";
  const { isNaN } = Number;
  const isInputNaN: boolean = isNaN(rad);

  const hasInvalidArguments: boolean = isInvalidType || isInputNaN;
  if (hasInvalidArguments) {
    const errorMessage: string = isInvalidType
      ? `Expected 'rad' to be a valid number, but got: ${rad}`
      : `Calculation of coordinates resulted in NaN for radian: ${rad}`;
    throw new TypeError(errorMessage);
  }

  const x1: number = roundToFloat((Math.cos(rad) + 1) / 2, 3);
  const y1: number = roundToFloat((Math.sin(rad) + 1) / 2, 3);

  const x2: number = roundToFloat(1 - x1, 3);
  const y2: number = roundToFloat(1 - y1, 3);

  return { x1, y1, x2, y2 };
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
