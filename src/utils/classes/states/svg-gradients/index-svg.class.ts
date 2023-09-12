import SVGLinearGradient from "./linear/svg-linear.class";
import SVGRadialGradient from "./radial/svg-radial.class";

type SVGGradientReturnType = SVGLinearGradient | SVGRadialGradient;

export type SVGSpreadMethods = "pad" | "reflect" | "repeat";

// Not type safe enough as you can set it to "lol(69)" and TS won't throw an error
export type SVGGradientTransformObject = {
  [TTransformFunction in SVGGradientTransformFunctions]?: number;
};

export type SVGGradientTransformFunctions =
  | "matrix"
  | "matrix3d"
  | "perspective"
  | "rotate"
  | "rotate3d"
  | "rotateX"
  | "rotateY"
  | "rotateZ"
  | "scale"
  | "scale3d"
  | "scaleX"
  | "scaleY"
  | "scaleZ"
  | "skew"
  | "skewX"
  | "skewY"
  | "translate"
  | "translate3d"
  | "translateX"
  | "translateY"
  | "translateZ";

// Not type safe enough as you can set it to "lol(69)" and TS won't throw an error
export type SVGGradientTransformString =
  `${SVGGradientTransformFunctions}(${number})`;

const test: SVGGradientTransformString = "rotate(90)";

export type SVGGradientUnits = "objectBoundingBox" | "userSpaceOnUse";
/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
export type SVGLinearGradientColorStop = {
  id: number;
  color: string;
  offset: string | null;
  opacity: string;
};

export type SVGCoordsFromRadian = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type SVGRadialGradientAttributes = {
  centerX: string;
  centerY: string;
  radius: string;
  focalRadius: string;
  focalX: string;
  focalY: string;
};
/**
 * Base class for SVG Gradients
 * @abstract
 */
abstract class SVGGradient {
  /**
   * Factory method to create SVG gradient instances based on the type
   * @param {"linear" | "radial"} gradientType - The type of gradient
   * @returns {SVGGradient} - An instance of the specific SVG gradient type
   */
  static create(gradientType: "linear" | "radial"): SVGGradientReturnType {
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
