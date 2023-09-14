import CSSConicGradient from "./conic/css-conic.class";
import CSSLinearGradient from "./linear/css-linear.class";
import CSSRadialGradient from "./radial/css-radial.class";

export type CSSGradientReturnType =
  | CSSLinearGradient
  | CSSRadialGradient
  | CSSConicGradient;

/**
 * Base class for CSS Gradients
 * @abstract
 */
class CSSGradient {
  /**
   * Factory method to create CSS gradient instances based on the type
   * @param {"linear" | "radial" | "conic"} gradientType - The type of gradient
   * @returns {CSSGradient} - An instance of the specific CSS gradient type
   */
  create(gradientType: "linear" | "radial" | "conic"): CSSGradientReturnType {
    switch (gradientType) {
      case "linear": {
        return new CSSLinearGradient();
      }
      case "radial": {
        return new CSSRadialGradient();
      }
      case "conic": {
        return new CSSConicGradient();
      }
      default:
        throw new Error(`Unsupported CSS gradient type: ${gradientType}`);
    }
  }
}

export default CSSGradient;
