import CSSGradient, {
  CSSGradientReturnType,
} from "./css-gradients/index-css.class";

import SVGGradient, {
  SVGGradientReturnType,
} from "./svg-gradients/index-svg.class";

import JSCanvasGradient, {
  CanvasGradientReturnType,
} from "./canvas-gradients/index-canvas.class";
import { log } from "@utils/helpers/console.helpers";

export type GradientLanguage = "css" | "svg" | "canvas";
export type GradientType = "linear" | "radial" | "conic";

export type GradientReturnType =
  | CSSGradientReturnType
  | SVGGradientReturnType
  | CanvasGradientReturnType;

class Gradient {
  create(
    language: GradientLanguage,
    gradientType: GradientType,
    context?: CanvasRenderingContext2D
  ): GradientReturnType {
    log(language, gradientType);
    switch (language) {
      case "css": {
        return new CSSGradient().create(gradientType) as CSSGradientReturnType;
      }
      case "svg": {
        // Conic gradients do not exist in SVG
        return new SVGGradient().create(
          gradientType as "linear" | "radial"
        ) as SVGGradientReturnType;
      }
      case "canvas": {
        // Contexts are mandatory for Canvases
        return new JSCanvasGradient().create(
          gradientType,
          context
        ) as CanvasGradientReturnType;
      }
      default: {
        throw new Error(`Unsupported canvas gradient type: ${gradientType}`);
      }
    }
  }
}

export default Gradient;
