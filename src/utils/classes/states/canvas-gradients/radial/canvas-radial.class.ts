import CanvasGradientBase from "../class-base/canvas-gradient-base.class";

class CanvasRadialGradient extends CanvasGradientBase {
  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;
  }
}

export default CanvasRadialGradient;
