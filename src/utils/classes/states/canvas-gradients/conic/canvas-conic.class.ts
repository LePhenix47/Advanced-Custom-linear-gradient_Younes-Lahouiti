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
    this.startAngle = startAngle;
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

    let codeString: string = `const canvas = document.getElementById("canvas");
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
