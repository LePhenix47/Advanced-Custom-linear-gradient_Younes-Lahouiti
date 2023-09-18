import { PointerInfosType } from "@utils/variables/global-states/pointer-infos";

class CanvasRenderMethods {
  lineWidth: number;
  lineFill: string;
  circleFill: string;
  circleRadius: number;
  midX: number;
  midY: number;
  ctx: CanvasRenderingContext2D;
  strokeWidth: number;
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.lineWidth = 2;
    this.lineFill = "#5b5b5b";

    this.circleFill = "#4285f4";
    this.circleRadius = this.canvas.width / 20;

    this.midX = this.canvas.width / 2;
    this.midY = this.canvas.height / 2;
  }

  drawLine({
    initX,
    initY,
    arrayOfCoords = [{ x: 0, y: 0 }],
    lineDash = [],
    strokeFill = this.lineFill,
    strokeWidth = this.lineWidth,
  }) {
    this.ctx.beginPath();
    this.ctx.setLineDash(lineDash);
    this.ctx.moveTo(initX, initY);

    for (const { x, y } of arrayOfCoords) {
      this.ctx.lineTo(x, y);
    }

    this.ctx.strokeStyle = strokeFill;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawCircle(x: number, y: number, hasStroke: boolean = false): void {
    this.ctx.fillStyle = this.circleFill;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.circleRadius, 0, Math.PI * 2);
    this.ctx.fill();

    if (hasStroke) {
      this.ctx.strokeStyle = this.lineFill;
      this.ctx.lineWidth = this.strokeWidth;

      this.ctx.stroke();
    }
  }
}

class OffsetCreator extends CanvasRenderMethods {
  offsetPickerX: any;
  offsetPickerY: any;
  computedOffsetX: number;
  computedOffsetY: number;
  pointerInfos: PointerInfosType;

  constructor(canvas: HTMLCanvasElement, pointerInfos: PointerInfosType) {
    super(canvas);

    this.offsetPickerX = this.midX;
    this.offsetPickerY = this.midY;

    this.pointerInfos = pointerInfos;

    // Will set the X and Y offset from the center of the canvas
    this.computedOffsetX = 0;
    this.computedOffsetY = 0;

    this.drawCardinalLines();
  }

  private drawCardinalLines() {
    this.drawLine({
      initX: 0,
      initY: this.midY,
      arrayOfCoords: [{ x: this.canvas.width, y: this.midY }],
      lineDash: [this.lineWidth, this.lineWidth],
      strokeFill: this.lineFill,
      strokeWidth: this.lineWidth,
    });

    this.drawLine({
      initX: this.midX,
      initY: 0,
      arrayOfCoords: [{ x: this.midX, y: this.canvas.height }],
      lineDash: [this.lineWidth, this.lineWidth],
      strokeFill: this.lineFill,
      strokeWidth: this.lineWidth,
    });
  }

  // offsetCreator.trackPointer()

  private checkOverflow() {
    // this.offsetPickerX;
    const overflowsHorizontally: boolean =
      this.offsetPickerX + this.circleRadius > this.canvas.width;
    if (overflowsHorizontally) {
      this.offsetPickerX = this.canvas.width - this.circleRadius;
    }

    // this.offsetPickerY;
    const overflowsVertically: boolean =
      this.offsetPickerY + this.circleRadius > this.canvas.height;
    if (overflowsVertically) {
      this.offsetPickerY = this.canvas.height - this.circleRadius;
    }
  }

  private checkUnderflow() {
    // this.offsetPickerX;
    const underflowsHorizontally: boolean =
      this.offsetPickerX - this.circleRadius < 0;
    if (underflowsHorizontally) {
      this.offsetPickerX = 0 + this.circleRadius;
    }

    // this.offsetPickerY;
    const underflowsVertically: boolean =
      this.offsetPickerY - this.circleRadius < 0;
    if (underflowsVertically) {
      this.offsetPickerY = 0 + this.circleRadius;
    }
  }

  updateTrackerCoords() {
    const { isPressing, x, y } = this.pointerInfos;

    if (isPressing) {
      this.offsetPickerX = x;
      this.offsetPickerY = y;

      this.checkOverflow();
      this.checkUnderflow();

      this.computedOffsetX = Math.round(
        ((this.offsetPickerX - this.midX) / 10) * 4.5
      );
      // Canvases use the SVG coordinates system
      this.computedOffsetY = Math.round(
        ((this.midY - this.offsetPickerY) / 10) * 4.5
      );
    }
  }

  getOffsets(isPercentage: boolean = false): any {
    const normalizedX: number = (this.computedOffsetX + 20) / 40;
    const normalizedY: number = (this.computedOffsetY + 20) / 40;

    const pX: number = Math.round(normalizedX * 100);
    const pY: number = Math.round((1 - normalizedY) * 100);

    if (isPercentage) {
      return {
        x: pX,
        y: pY,
      };
    }

    return {
      x: this.computedOffsetX,
      y: this.computedOffsetY,
    };
  }

  // We need to update the coords THEN draw the tracker
  trackPointer() {
    this.drawCardinalLines();

    this.drawLine({
      initX: this.midX,
      initY: this.midY,
      arrayOfCoords: [{ x: this.offsetPickerX, y: this.offsetPickerY }],
      strokeFill: this.lineFill,
      strokeWidth: this.lineWidth,
    });

    this.drawCircle(this.offsetPickerX, this.offsetPickerY);
  }
}

export default OffsetCreator;
