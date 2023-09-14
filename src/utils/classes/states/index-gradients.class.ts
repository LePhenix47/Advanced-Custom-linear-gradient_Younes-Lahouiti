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
  create(
    language: GradientLanguage,
    gradientType: GradientType,
    context?: CanvasRenderingContext2D
  ): GradientReturnType {
    switch (language) {
      case "css": {
        return new CSSGradient().create(gradientType);
      }
      case "svg": {
        // Conic gradients do not exist in SVG
        return new SVGGradient().create(gradientType as "linear" | "radial");
      }
      case "canvas": {
        // Contexts are mandatory for Canvases
        return new JSCanvasGradient().create(gradientType, context);
      }
      default: {
        throw new Error(`Unsupported canvas gradient type: ${gradientType}`);
      }
    }
  }
}

export default Gradient;

//TEST
// TS should not throw an error
new Gradient().create("css", "conic"); // Shouldn't throw an error and doesn't

// TS SHOULD throw an error
new Gradient().create("svg", "conic"); // FAIL, TS didn't throw an error: It should though because here on the second argument
new Gradient().create("canvas", "linear"); // FAIL, TS didn't throw an error: It should though because here because I didn't add the context here
