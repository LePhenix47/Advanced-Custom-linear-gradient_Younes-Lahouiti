import CanvasGradientBase, {
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
   * @param {number} radius - The radius of the inner circle.
   */
  setInnerCircle(x: number, y: number, radius: number): void {
    this.innerCircle = { x, y, radius };
  }

  /**
   * Set the final coordinates and radius of the outer circle.
   *
   * @param {number} x - The x-coordinate of the outer circle's center.
   * @param {number} y - The y-coordinate of the outer circle's center.
   * @param {number} radius - The radius of the outer circle.
   */
  setOuterCircle(x: number, y: number, radius: number): void {
    this.outerCircle = { x, y, radius };
  }

  generateCanvasGradient(): { gradient: CanvasGradient; code: string | null } {
    const { x: x0, y: y0, radius: r0 } = this.innerCircle;
    const { x: x1, y: y1, radius: r1 } = this.outerCircle;
    const {} = this.outerCircle;

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

    let codeString: string = `const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gradient = ctx.createRadialGradient(${x0}, ${y0}, ${r0}, ${x1}, ${y1}, ${r1});\n`;

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
