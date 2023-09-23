import { radiansToDegrees } from "@utils/helpers/math.helpers";
import CanvasGradientBase, {
  CanvasConicGradientColorStop,
} from "../class-base/canvas-gradient-base.class";

class CanvasConicGradient extends CanvasGradientBase {
  centerPosition: { x: number; y: number };
  startAngle: number; // In radians

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;

    this.centerPosition = { x: 0, y: 0 };
    this.startAngle = 0; // Default start angle is 0 radians
  }

  /**
   * Set the center position of the conic gradient.
   *
   * @param {number} x - The x-coordinate of the center.
   * @param {number} y - The y-coordinate of the center.
   */
  setCenterPosition(x: number, y: number): void {
    this.centerPosition = { x, y };
  }

  /**
   * Set the start angle of the conic gradient in radians.
   *
   * @param {number} startAngle - The start angle in radians.
   */
  setStartAngle(startAngle: number): void {
    const angleInDegrees: number = radiansToDegrees(startAngle);

    this.startAngle = angleInDegrees;
  }

  /**
   * Normalizes the values of a stop color by converting opacity to a hexadecimal alpha value
   * and checking if the transition angle is within the range of the color's start & end angle
   *
   * @param {CSSConicGradientColorStop} stopColor - The stop color to normalize.
   *
   * @returns {void}
   *
   * @private
   */
  private normalizeStopColorValues(stopColor): void {
    this.normalizeOpacity(stopColor);

    // this.normalizeAngles(stopColor);
  }

  /**
   * Checks if a transition angle is within the specified range (inclusive).
   *
   * @param {number} startAngle - The start angle in degrees.
   * @param {number} endAngle - The end angle in degrees.
   * @param {number|null} transitionAngle - The transition angle in degrees to check, or null if no transition angle is provided.
   *
   * @returns {boolean} - True if the transition angle is within the specified range, false otherwise.
   *
   * @throws {TypeError} - Throws a TypeError if any of the input arguments have invalid types or are NaN.
   *
   * @private
   */
  private isTransitionAngleValid(
    startAngle: number,
    endAngle: number,
    transitionAngle: number
  ): boolean {
    const hasNoTransitionAngle: boolean = transitionAngle === null;
    if (hasNoTransitionAngle) {
      return true;
    }

    const { isNaN } = Number;
    const inputtedArguments: number[] = [startAngle, endAngle, transitionAngle];

    for (const arg of inputtedArguments) {
      const hasInvalidType: boolean = typeof arg !== "number";
      const hasNaNValue: boolean = isNaN(arg);

      const argumentIsInvalid: boolean = hasInvalidType || hasNaNValue;
      if (argumentIsInvalid) {
        const errorMessage: string = hasInvalidType
          ? `Invalid argument type, must be a number, got: ${arg} of type ${typeof arg}`
          : `Invalid number value, received NaN, got: ${arg} of type ${typeof arg}`;

        throw new TypeError(errorMessage);
      }
    }

    const isWithinRange: boolean =
      transitionAngle >= startAngle && transitionAngle <= endAngle;

    return isWithinRange;
  }

  /**
   * Add a stop color to the conic gradient.
   * @param {CSSConicGradientColorStop} stopColor - The stop color to add.
   * @throws {TypeError} If the stopColor object is missing required properties.
   * @returns {void}
   */
  addStopColor(stopColor): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = [
      "id",
      "color",
      "startAngle",
      "endAngle",
      "transitionAngle",
      "opacity",
    ];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the conic gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.normalizeStopColorValues(stopColor);

    const { startAngle, endAngle, transitionAngle } = stopColor;
    this.isTransitionAngleValid(
      startAngle as number,
      endAngle as number,
      transitionAngle as number
    );

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  generateCanvasGradient(): { gradient: CanvasGradient; code: string | null } {
    const { x: centerX, y: centerY } = this.centerPosition;

    const gradient: CanvasGradient = this.context.createConicGradient(
      centerX,
      centerY,
      this.startAngle
    );

    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return { gradient, code: null };
    }

    let codeString: string = `
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gradient = ctx.createConicGradient(${centerX}, ${centerY}, ${this.startAngle});\n`;

    for (let i = 0; i < this.stopColors.length; i++) {
      const stopColor: CanvasConicGradientColorStop = this.stopColors[i];

      const { color, offset } = stopColor;

      const numberOffset = offset as number;

      const { isNaN } = Number;
      const defaultIndexOffset: number = isNaN(numberOffset)
        ? this.getOffsetByIndex(i, this.stopColors.length)
        : numberOffset;

      gradient.addColorStop(defaultIndexOffset, color);

      codeString += `gradient.addColorStop(${defaultIndexOffset}, ${color});\n`;
    }

    codeString += `
ctx.fillStyle = gradient;\n
ctx.fillRect(0, 0, canvas.width, canvas.height);\n`;

    return { gradient, code: codeString };
  }
}

export default CanvasConicGradient;
