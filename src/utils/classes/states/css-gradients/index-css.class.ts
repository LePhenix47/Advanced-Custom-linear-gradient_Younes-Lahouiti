import CSSConicGradient from "./conic/css-conic-gradient.class";
import CSSLinearGradient from "./linear/css-linear-gradient.class";
import CSSRadialGradient from "./radial/css-radial-gradient.class";

type CSSGradientReturnType =
  | CSSLinearGradient
  | CSSRadialGradient
  | CSSConicGradient;

/**
 * Base class for CSS Gradients
 * @abstract
 */
abstract class CSSGradient {
  /**
   * Factory method to create CSS gradient instances based on the type
   * @param {"linear" | "radial" | "conic"} gradientType - The type of gradient
   * @returns {CSSGradient} - An instance of the specific CSS gradient type
   */
  static create(
    gradientType: "linear" | "radial" | "conic"
  ): CSSGradientReturnType {
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
        throw new Error(`Unsupported gradient type: ${gradientType}`);
    }
  }

  /**
   * Abstract method for setting the repeating property of the gradient.
   * This method should be implemented by subclasses.
   * @param {boolean} repeatValue - Whether the gradient should repeat.
   *
   * @abstract
   */
  abstract setRepeating(repeatValue: boolean): void;

  /**
   * Abstract method for generating the CSS gradient string.
   * This method should be implemented by subclasses.
   * @returns {string} - The CSS gradient string.
   *
   * @abstract
   */
  abstract generateCssGradient(): string;

  /**
   * Abstract method for adding a stop color to the gradient.
   * This method should be implemented by subclasses.
   *
   * @abstract
   */
  abstract addStopColor(stopColor: unknown): void;
}

export default CSSGradient;
