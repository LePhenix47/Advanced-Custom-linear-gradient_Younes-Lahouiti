import CanvasGradientBase, {
  CanvasGradientColorStop,
  CanvasRadialGradientColorStop,
} from "../class-base/canvas-gradient-base.class";

class CanvasRadialGradient extends CanvasGradientBase {
  innerCircle: { x: number; y: number; radius: number };
  outerCircle: { x: number; y: number; radius: number };

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;

    this.innerCircle = { x: 0, y: 0, radius: 0 };
    this.outerCircle = { x: 0, y: 0, radius: 0 };
  }

  /**
   * Set the initial coordinates and radius of the inner circle.
   *
   * @param {number} x - The x-coordinate of the inner circle's center.
   * @param {number} y - The y-coordinate of the inner circle's center.
   */
  setInnerCirclePosition(x: string, y: string): void {
    this.innerCircle.x = Number(x.replaceAll("%", ""));
    this.innerCircle.y = Number(y.replaceAll("%", ""));
  }

  setInnerCircleRadius(radius: string): void {
    this.innerCircle.radius = Number(radius.replaceAll("%", ""));
  }
  /**
   * Set the initial coordinates and radius of the inner circle.
   *
   * @param {number} x - The x-coordinate of the inner circle's center.
   * @param {number} y - The y-coordinate of the inner circle's center.
   */
  setOuterCirclePosition(x: string, y: string): void {
    this.outerCircle.x = Number(x.replaceAll("%", ""));
    this.outerCircle.y = Number(y.replaceAll("%", ""));
  }

  setOuterCircleRadius(radius: string): void {
    this.outerCircle.radius = Number(radius.replaceAll("%", ""));
  }

  private normalizeStopColorValues(stopColor: CanvasGradientColorStop) {
    this.normalizeOpacity(stopColor);

    this.normalizeOffset(stopColor);
  }

  /**
   * Add a stop color to the linear gradient.
   * @param {CSSLinearGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: CanvasGradientColorStop): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = ["id", "color", "offset", "opacity"];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the linear gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.normalizeStopColorValues(stopColor);

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  generateCanvasGradient(): { gradient: CanvasGradient; code: string | null } {
    const { x: x0, y: y0, radius: r0 } = this.innerCircle;
    const { x: x1, y: y1, radius: r1 } = this.outerCircle;

    const gradient: CanvasGradient = this.context.createRadialGradient(
      x0,
      y0,
      r0,
      x1,
      y1,
      r1
    );

    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return { gradient, code: null };
    }
    const { canvas } = this.context;

    const normalizedX0: string = x0 === canvas.width ? "canvas.width" : `${x0}`;
    const normalizedX1: string = x1 === canvas.width ? "canvas.width" : `${x1}`;

    const normalizedY0: string =
      y0 === canvas.height ? "canvas.height" : `${y0}`;
    const normalizedY1: string =
      y1 === canvas.height ? "canvas.height" : `${y1}`;

    let codeString: string = `
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gradient = ctx.createLinearGradient(${normalizedX0}, ${normalizedY0}, ${r0}, ${normalizedX1}, ${normalizedY1}, ${r1});\n`;

    for (let i = 0; i < this.stopColors.length; i++) {
      const stopColor: CanvasRadialGradientColorStop = this.stopColors[i];

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

export default CanvasRadialGradient;
