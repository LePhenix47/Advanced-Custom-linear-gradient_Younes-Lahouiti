import { roundToFloat } from "./number.helpers";

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
