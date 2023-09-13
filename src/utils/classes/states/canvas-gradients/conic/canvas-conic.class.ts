import CanvasGradientBase from "../class-base/canvas-gradient-base.class";

class CanvasConicGradient extends CanvasGradientBase {
  startAngleCoords: { x1: number; y1: number; x2: number; y2: number };
  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;

    this.startAngleCoords = {
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
    };
  }
}

export default CanvasConicGradient;
