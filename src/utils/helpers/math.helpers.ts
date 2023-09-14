import { hexadecimalToDecimal, roundToFloat } from "./number.helpers";

/**
 * Calculates the nth root of a number.
 *
 * By default acts as a square root `√(x)`
 *
 * @param {number} value - The value for which to calculate the nth root.
 * @param {number} [root=2] - The degree of the root.
 *
 * @returns {number} The nth root of the value.
 * @throws {Error} If the root is null or if the root of the value is invalid.
 */
export function nthRoot(value: number, root: number = 2): number {
  const rootIsInvalid: boolean = root === 0;
  if (rootIsInvalid) {
    throw new Error(
      `The root cannot be null, as it returns an exponent with a division by 0`
    );
  }

  // We check that the value is negative AND that the root is even
  const valueOfRootIsInvalid: boolean = value < 0 && root % 2 === 0;
  if (valueOfRootIsInvalid) {
    // Negative values cannot have an even root
    //∛(-27) = -3 but √(-16) = undefined
    throw new Error(
      `The root: ${root} of the value: ${value} passed is invalid, cannot have a negative value with an even root`
    );
  }

  //To avoid JS returning us a NaN even with odd roots of negative values
  //We set the value to be positive by taking their absolute value: |x|
  //Then we use the formula ⁿ√(x) = x^(1/n)
  let calculatedRoot: number = Math.abs(value) ** (1 / root);

  //And we now return the nth root of a positive or negative value
  return value > 0 ? calculatedRoot : -1 * calculatedRoot;
}

/**
 * Calculates the logarithm of a value with a specified base.
 * By default acts as a natural logarithm `logₑ(x)` aka `Ln(x)`
 *
 * @param {number} value - The value for which to calculate the logarithm.
 * @param {number} [base= Math.E] - The base of the logarithm. Default is Euler's number.
 *
 *  @returns {number | NaN} The logarithm of the value or Not A Number `NaN` if the arguments passed are invalid
 */
export function logarithm(value: number, base: number = Math.E): number {
  //We check that the base is positive but also different than 1
  //since log(1) = 0 and logₙ(x) = log(x)/log(n), a base of 1 would give a division by 0
  const baseIsInvalid: boolean = base <= 0 || base === 1;
  if (baseIsInvalid) {
    throw new Error(
      `The base of the logarithm ${
        base <= 0 ? "is negative or null" : "returns a division by 0"
      }`
    );
  }

  //Logarithmic functions cannot have a negative or null value
  const valueIsInvalid: boolean = value <= 0;
  if (valueIsInvalid) {
    throw new Error("The value passed is negative or null");
  }

  return Math.log(value) / Math.log(base);
}

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

  const { PI } = Math;
  const radians: number = (degrees * PI) / 180;

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

  const { PI } = Math;
  const degrees: number = (radians * 180) / PI;

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

  const { cos, sin } = Math;

  const x1: number = roundToFloat((cos(rad) + 1) / 2, 3);
  const y1: number = roundToFloat((sin(rad) + 1) / 2, 3);

  const x2: number = roundToFloat(1 - x1, 3);
  const y2: number = roundToFloat(1 - y1, 3);

  return { x1, y1, x2, y2 };
}
