import { CanvasGradientColorStop } from "@utils/classes/states/canvas-gradients/class-base/canvas-gradient-base.class";
import { CSSGradientColorStop } from "@utils/classes/states/css-gradients/class-base/css-gradient-base.class";
import {
  GradientColorStop,
  GradientLanguage,
  GradientType,
} from "@utils/classes/states/index-gradients.class";
import {
  SVGGradientColorStop,
  SVGGradientTransformObject,
} from "@utils/classes/states/svg-gradients/index-svg.class";
import { copyArray } from "@utils/helpers/array.helpers";
import { log, table } from "@utils/helpers/console.helpers";
import {
  getAttributeFrom,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
  setAttributeFrom,
} from "@utils/helpers/dom.helpers";
import { getObjectValues } from "@utils/helpers/object.helpers";

type TransformFunction = {
  functionName: string;
  value: number | string | object;
};

export type GradientInfos = {
  language: "css" | "svg" | "canvas"; // Language is limited to these values
  type: "linear" | "radial" | "conic"; // Type is limited to these values
  stopColors:
    | CSSGradientColorStop[]
    | SVGGradientColorStop[]
    | CanvasGradientColorStop[];
  options: {
    css: {
      linear: {
        orientation: number; // Orientation should be a number
      };
      radial: {
        x: string; // x should be a string
        y: string; // y should be a string
        shape: "circle" | "ellipse"; // Type is limited to these values
        size:
          | "closest-side"
          | "closest-corner"
          | "farthest-side"
          | "farthest-corner";
      };
      conic: {
        orientation: number; // Orientation should be a number
        x: string; // x should be a string
        y: string; // y should be a string
      };
      common: {
        isRepeating: boolean; // isRepeating should be a boolean
      };
    };
    svg: {
      linear: {
        orientation: number; // Orientation should be a number
      };
      radial: {
        centerX: string; // centerX should be a string
        centerY: string; // centerY should be a string
        radius: string; // radius should be a string
        focalX: string; // focalX should be a string
        focalY: string; // focalY should be a string
        focalRadius: string; // focalRadius should be a string
      };
      common: {
        gradientUnits: "userSpaceOnUse" | "objectBoundingBox"; // Limited values
        transformFunctions: TransformFunction[]; // transformFunctions should be a string
        spreadMethod: "pad" | "reflect" | "repeat"; // Limited values
      };
    };
    canvas: {
      linear: {};
      radial: {
        innerX: string;
        innerY: string;
        radius: string;
        outerX: string;
        outerY: string;
        focalRadius: string;
      };
      conic: {
        startAngle: number;
        centerX: number;
        centerY: number;
      };
    };
  };
};

export const gradientInfos: GradientInfos = {
  language: "css",
  type: "linear",
  stopColors: [],
  options: {
    css: {
      linear: {
        orientation: 0,
      },
      radial: {
        x: "50%",
        y: "50%",
        shape: "circle",
        size: "closest-side",
      },
      conic: {
        orientation: 0,
        x: "50%",
        y: "50%",
      },
      common: {
        isRepeating: false,
      },
    },
    svg: {
      linear: {
        orientation: 0,
      },
      radial: {
        centerX: "50%",
        centerY: "50%",
        radius: "50%",
        focalX: "50%",
        focalY: "50%",
        focalRadius: "0%",
      },
      common: {
        gradientUnits: "objectBoundingBox",
        transformFunctions: [
          {
            functionName: "rotate",
            value: 0,
          },
        ],
        spreadMethod: "pad",
      },
    },
    canvas: {
      linear: {},
      radial: {
        innerX: "50%",
        innerY: "50%",
        radius: "50%",
        outerX: "50%",
        outerY: "50%",
        focalRadius: "0%",
      },
      conic: {
        centerX: 0,
        centerY: 0,
        startAngle: 0,
      },
    },
  },
};

/**
 * Removes duplicates from an array of transform objects based on the `functionName` property.
 * @param {TransformFunction[]} transforms - The array of transform objects.
 * @returns {TransformFunction[]} An array with duplicates removed.
 */
export function removeDuplicateTransformsByFunctionName(
  transforms: TransformFunction[]
): TransformFunction[] {
  const seenFunctionNames = {};

  // Array.from()
  const copiedArray = copyArray(transforms);

  const filteredOutArray = copiedArray
    .reverse()
    .reduce((uniqueTransforms, transform) => {
      const isUnique: boolean = !seenFunctionNames[transform.functionName];
      if (isUnique) {
        seenFunctionNames[transform.functionName] = true;
        uniqueTransforms[transform.functionName] = transform;
      }
      return uniqueTransforms;
    }, {});

  // Object.values()
  const objectKeyNames = getObjectValues(filteredOutArray);

  return objectKeyNames;
}

export function addTransformToGradientInfos(transform: TransformFunction) {
  gradientInfos.options.svg.common.transformFunctions.push(transform);

  gradientInfos.options.svg.common.transformFunctions =
    removeDuplicateTransformsByFunctionName(
      gradientInfos.options.svg.common.transformFunctions
    );
}

export function deleteTransformToGradientInfos(transform: TransformFunction) {
  const currentTransforms = gradientInfos.options.svg.common.transformFunctions;

  const indexToDelete: number =
    gradientInfos.options.svg.common.transformFunctions.findIndex(
      (currentTransform) => {
        return currentTransform.functionName === transform.functionName;
      }
    );

  const hasFoundIndex: boolean = indexToDelete !== -1;
  if (hasFoundIndex) {
    // Use splice to remove the transform from the array
    gradientInfos.options.svg.common.transformFunctions =
      currentTransforms.splice(indexToDelete, 1);
  } else {
    throw new Error(`Invalid transform function inputted ${transform}`);
  }
  // ADD logic to remove that transform inputted as an argument
}

/**
 * Retrieves the values of the chosen transform based on the type.
 * @param {HTMLFieldSetElement} fieldSet - The fieldset containing the transform inputs.
 * @return {TransformFunction} The transform function object with functionName and value.
 */
export function getTransformValues(
  fieldSet: HTMLFieldSetElement
): TransformFunction {
  const dataAttributeFunction: string | null = fieldSet.dataset.transform;
  if (!dataAttributeFunction) {
    throw new Error("Fieldset does not have a valid data-transform attribute.");
  }

  const transformType = dataAttributeFunction.trim();
  const inputs = fieldSet.querySelectorAll<HTMLInputElement>(
    'input[type="number"]'
  );
  const values: Record<string, number | string> = {};

  inputs.forEach((input) => {
    const paramName = input.name;
    const paramValue = input.value.trim();
    if (paramValue !== "") {
      values[paramName] = Number(paramValue);
    }
  });

  return {
    functionName: transformType,
    value:
      Object.keys(values).length === 1
        ? values[Object.keys(values)[0]][0]
        : values,
  };
}

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

// Needs to be implemented
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
        // Handle color input (Assuming it's an <input type="color"> element)
        const colorInput = selectQuery<HTMLInputElement>(
          "input[type=color]",
          cell
        );
        stopColor.color = colorInput.value;
        break;
      }
      case 3: {
        // Handle opacity input (Assuming it's an <input type="number"> element)
        const opacityInput = selectQuery<HTMLInputElement>(
          "input[type=number]",
          cell
        );
        if (opacityInput) {
          const opacityValue: number = opacityInput.valueAsNumber;

          stopColor.opacity = `${opacityValue}%`;
        }
        break;
      }

      case 4:
      case 5:
      case 6: {
        const isStartingAngle: boolean = i === 4;

        const isEndingAngle: boolean = i === 5;

        const isTransitionAngle: boolean = i === 6;

        let angleProperty: string = "";
        if (isStartingAngle) {
          angleProperty = "startAngle";
        } else if (isEndingAngle) {
          angleProperty = "endAngle";
        } else if (isTransitionAngle) {
          angleProperty = "transitionAngle";
        }

        const anglePicker = selectQuery<HTMLElement>("angle-picker", cell);
        const checkbox = selectQuery<HTMLInputElement>(
          "input[type=checkbox]",
          cell
        );

        const angleInDegrees: number | null = checkbox.checked
          ? Number(getAttributeFrom("angle", anglePicker)) ?? 0
          : null;

        stopColor[angleProperty] = angleInDegrees;
        break;
      }

      default:
        break;
    }
  }

  //@ts-ignore
  gradientInfos.stopColors.push(stopColor);
}
