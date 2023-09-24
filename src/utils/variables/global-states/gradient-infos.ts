import { CanvasGradientColorStop } from "@utils/classes/states/canvas-gradients/class-base/canvas-gradient-base.class";
import { CSSGradientColorStop } from "@utils/classes/states/css-gradients/class-base/css-gradient-base.class";
import {
  GradientColorStop,
  GradientLanguage,
  GradientType,
} from "@utils/classes/states/index-gradients.class";
import { SVGGradientColorStop } from "@utils/classes/states/svg-gradients/index-svg.class";
import { log, table } from "@utils/helpers/console.helpers";
import {
  getAttributeFrom,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
  setAttributeFrom,
} from "@utils/helpers/dom.helpers";

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
    css: {
      linear: {
        orientation: "0deg",
      },
      radial: {
        x: "50%",
        y: "50%",
      },
      conic: {
        orientation: "0deg",
        x: "50%",
        y: "50%",
      },
      common: {
        isRepeating: false,
      },
    },
    svg: {
      linear: {
        orientation: "0deg",
      },
      radial: {},
      common: {
        gradientUnits: "objectBoundingBox",
        transformFunctions: "",
        spreadMethod: "pad",
      },
    },
    canvas: {
      linear: {},
      radial: {},
      conic: {},
      common: {},
    },
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

export function setStopColorPropertyById(
  id: number,
  property: string,
  value: any
) {
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

export function getAllStopColorStateValuesFromTable() {
  resetStopColorsState();

  const tableBody =
    selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

  const tableRowsArray = selectQueryAll<HTMLTableRowElement>("tr", tableBody);

  const isConicGradient: boolean = gradientInfos.type === "conic";

  for (let i = 0; i < tableRowsArray.length; i++) {
    const row: HTMLTableRowElement = tableRowsArray[i];

    const cells = selectQueryAll<HTMLTableCellElement>("td", row);

    const currentIndex: number = i + 1;
    if (isConicGradient) {
      setStopColorForConicGradient(cells, currentIndex);
    } else {
      setStopColorForNonConicGradient(cells, currentIndex);
    }
  }

  // table(gradientInfos.stopColors);
}

export function setStopColorForNonConicGradient(
  cells: HTMLTableCellElement[],
  currentIndex: number
) {
  const stopColor: Extract<GradientColorStop, { offset: string | null }> = {
    id: currentIndex,
    color: "#000000",
    offset: null,
    opacity: "100%",
  };

  for (let i = 2; i < cells.length - 1; i++) {
    const cell: HTMLTableCellElement = cells[i];

    switch (i) {
      case 2: {
        const colorInput = selectFirstByClass<HTMLInputElement>(
          "menu__input-color",
          cell
        );

        stopColor.color = colorInput.value;
        break;
      }

      case 3: {
        const offsetInput = selectFirstByClass<HTMLInputElement>(
          "menu__input",
          cell
        );

        const { isNaN } = Number;
        stopColor.offset = isNaN(offsetInput.valueAsNumber)
          ? null
          : `${offsetInput.value}%`;
        break;
      }

      case 4: {
        const opacityInput = selectFirstByClass<HTMLInputElement>(
          "menu__input",
          cell
        );

        const { isNaN } = Number;
        stopColor.opacity = isNaN(opacityInput.valueAsNumber)
          ? null
          : `${opacityInput.value}%`;
        break;
      }

      default:
        break;
    }
  }

  //@ts-ignore
  gradientInfos.stopColors.push(stopColor);
}

export function setStopColorForConicGradient(
  cells: HTMLTableCellElement[],
  currentIndex: number
) {
  const stopColor: Extract<
    GradientColorStop,
    { startAngle: string | number | null }
  > = {
    id: currentIndex,
    color: "#000000",
    opacity: "100%",
    startAngle: null,
    endAngle: null,
    transitionAngle: null,
  };

  for (let i = 2; i < cells.length - 1; i++) {
    const cell: HTMLTableCellElement = cells[i];

    switch (i) {
      case 2: {
        break;
      }

      default:
        break;
    }
  }

  //@ts-ignore
  gradientInfos.stopColors.push(stopColor);
}
