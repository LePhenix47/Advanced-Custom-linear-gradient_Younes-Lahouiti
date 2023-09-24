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

  options: any;
};

export const gradientInfos: GradientInfos = {
  language: "css",
  type: "linear",
  stopColors: [],
  options: {
    css: {},
    svg: {},
    canvas: {},
  },
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

export function resetStopColorsState() {
  gradientInfos.stopColors = [];
}

export function changePropertyByCellIndex(
  cellIndex: number,
  id: number,
  value: any,
  isConicGradient: boolean = false
): void {
  if (isConicGradient) {
  } else {
    switch (cellIndex) {
      case 2: {
        gradientInfos.stopColors;
        setStopColorProperty(id, "color", value);
        break;
      }
      case 3: {
        gradientInfos.stopColors;
        setStopColorProperty(id, "offset", `${value}%`);
        break;
      }
      case 4: {
        gradientInfos.stopColors;
        setStopColorProperty(id, "opacity", `${value}%`);
        break;
      }
      default:
        break;
    }
  }
}

export function setStopColorProperty(id: number, property: string, value: any) {
  try {
    const stopColorToModify = gradientInfos.stopColors.find((color) => {
      return color.id === id;
    });

    const didNotFoundColor: boolean = !stopColorToModify;
    if (didNotFoundColor) {
      throw new Error(
        `Could not find stop color to modify: ${stopColorToModify} for the id of: ${id}`
      );
    }

    const propertyDoesNotExist: boolean =
      !stopColorToModify.hasOwnProperty(property);
    if (propertyDoesNotExist) {
      throw new Error(`Property ${property} does not exist`);
    }

    stopColorToModify[property] = value;
  } catch (error) {
    console.error(error);
  }
}
