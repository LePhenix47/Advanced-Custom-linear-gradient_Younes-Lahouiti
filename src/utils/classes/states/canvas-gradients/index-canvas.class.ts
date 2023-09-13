import CanvasConicGradient from "./conic/canvas-conic.class";
import CanvasLinearGradient from "./linear/canvas-linear.class";
import CanvasRadialGradient from "./radial/canvas-radial.class";

type CanvasGradientReturnType =
  | CanvasLinearGradient
  | CanvasRadialGradient
  | CanvasConicGradient;

class JSCanvasGradient {
  /**
   * Factory method to create SVG gradient instances based on the type
   * @param {"linear" | "radial"} gradientType - The type of gradient
   * @returns {JSCanvasGradient} - An instance of the specific SVG gradient type
   */
  static create(
    gradientType: "linear" | "radial" | "conic",
    context: CanvasRenderingContext2D
  ): CanvasGradientReturnType {
    switch (gradientType) {
      case "linear": {
        return new CanvasLinearGradient(context);
      }
      case "radial": {
        return new CanvasRadialGradient(context);
      }
      case "conic": {
        return new CanvasConicGradient(context);
      }
      default: {
        throw new Error(`Unsupported canvas gradient type: ${gradientType}`);
      }
    }
  }
}
export default JSCanvasGradient;
