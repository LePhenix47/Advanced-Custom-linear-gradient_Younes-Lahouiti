import CSSGradient, {
  CSSGradientReturnType,
} from "./css-gradients/index-css.class";
import SVGGradient, {
  SVGGradientReturnType,
} from "./svg-gradients/index-svg.class";
import JSCanvasGradient, {
  CanvasGradientReturnType,
} from "./canvas-gradients/index-canvas.class";

type GradientLanguage = "css" | "svg" | "canvas";
type GradientType = "linear" | "radial" | "conic";

type GradientReturnType =
  | CSSGradientReturnType
  | SVGGradientReturnType
  | CanvasGradientReturnType;

class Gradient {
  /**
   * Factory method to create SVG gradient instances based on the type
   * @param {"linear" | "radial"} gradientType - The type of gradient
   * @returns {JSCanvasGradient} - An instance of the specific SVG gradient type
   */
  static create(
    language: GradientLanguage,
    gradientType: GradientType,
    context?: CanvasRenderingContext2D
  ): GradientReturnType {
    switch (language) {
      case "css": {
        return new CSSGradient().create(gradientType);
      }
      case "svg": {
        return new SVGGradient().create(gradientType as "linear" | "radial");
      }
      case "canvas": {
        return new JSCanvasGradient().create(gradientType, context);
      }
      default: {
        throw new Error(`Unsupported canvas gradient type: ${gradientType}`);
      }
    }
  }
}

export default Gradient;
