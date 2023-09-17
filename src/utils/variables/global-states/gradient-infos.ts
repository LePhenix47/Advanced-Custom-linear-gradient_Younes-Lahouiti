import { CanvasGradientColorStop } from "@utils/classes/states/canvas-gradients/class-base/canvas-gradient-base.class";
import { CSSGradientColorStop } from "@utils/classes/states/css-gradients/class-base/css-gradient-base.class";
import {
  GradientLanguage,
  GradientType,
} from "@utils/classes/states/index-gradients.class";
import { SVGGradientColorStop } from "@utils/classes/states/svg-gradients/index-svg.class";

type GradientInfos = {
  language: GradientLanguage;
  type: GradientType;
  stopColors:
    | CSSGradientColorStop[]
    | SVGGradientColorStop[]
    | CanvasGradientColorStop[];
  offset: null | "string";
  opacity: string;
  isRepeating: boolean;
};

export const gradientInfos: GradientInfos = {
  language: "css",
  type: "linear",
  stopColors: [],
  offset: null,
  opacity: "100%",
  isRepeating: false,
};

/*
ex:

gradientInfos.stopColors.push({
      id: 1,
      color: "#bdc3e1",
      offset: null,
      opacity: "100%",
    })
*/
