import SVGLinearGradient from "./linear/svg-linear.class";

type SVGGradientReturnType = SVGLinearGradient | SVGRadialGradient;

export type SVGSpreadMethods = "pad" | "reflect" | "repeat";

export type SVGCoordsFromRadian = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
/**
 * Base class for SVG Gradients
 * @abstract
 */
abstract class SVGGradient {
  /**
   * Factory method to create SVG gradient instances based on the type
   * @param {"linear" | "radial" | "conic"} gradientType - The type of gradient
   * @returns {SVGGradient} - An instance of the specific SVG gradient type
   */
  static create(
    gradientType: "linear" | "radial" | "conic"
  ): SVGGradientReturnType {
    switch (gradientType) {
      case "linear": {
        return new SVGLinearGradient();
      }
      case "radial": {
        return new SVGRadialGradient();
      }
      default: {
        throw new Error(`Unsupported gradient type: ${gradientType}`);
      }
    }
  }

  abstract setSpreadMethod(methodValue: SVGSpreadMethods): void;

  abstract generateSvgGradient(): string;

  abstract addStopColor(stopColor: unknown): void;
}

export default SVGGradient;
