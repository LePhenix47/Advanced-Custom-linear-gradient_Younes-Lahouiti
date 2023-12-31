import { log } from "@utils/helpers/console.helpers";
import {
  selectQueryAll,
  selectQuery,
  getAttributeFrom,
  selectFirstByClass,
  addClass,
  removeClass,
  getParent,
  selectByClass,
} from "@utils/helpers/dom.helpers";
import {
  addTransformToGradientInfos,
  deleteTransformToGradientInfos,
  getTransformValues,
  gradientInfos,
} from "@utils/variables/global-states/gradient-infos";

/**
 * Creates and configures a MutationObserver to monitor specified attributes of an HTMLElement.
 *
 * @param {HTMLElement} element - The element to observe for attribute changes.
 * @param {string[]} properties - An array of attribute names to monitor for changes.
 * @param {(attribute: string, mutationRecord: MutationRecord) => void} callback - A callback function to execute when an attribute changes.
 * @returns {MutationObserver} - The created MutationObserver instance.
 */
export function createMutationObserver(
  element: HTMLElement,
  properties: string[],
  callback: (attribute: string, mutationRecord: MutationRecord) => void
): MutationObserver {
  const observer = new MutationObserver((mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      const attribute: string = getAttributeFrom(
        mutation.attributeName,
        mutation.target as HTMLElement
      );

      const hasChangedValue: boolean = mutation.oldValue !== attribute;

      if (hasChangedValue) {
        callback(attribute, mutation);
      }
    }
  });

  observer.observe(element, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: properties,
  });

  return observer;
}

export function addCssOptionsListeners() {
  const cssGradientOptions = selectQueryAll<HTMLDivElement>(
    `.menu__options--css>*`
  );

  const linearCssOption: HTMLDivElement = cssGradientOptions[0];
  const linearGradientAnglePicker = selectQuery<HTMLDivElement>(
    "angle-picker",
    linearCssOption
  );

  createMutationObserver(
    linearGradientAnglePicker,
    ["angle"],
    (attribute: string) => {
      gradientInfos.options.css.linear.orientation = Number(attribute);
    }
  );

  const radialCssOption: HTMLDivElement = cssGradientOptions[1];
  const shapeSelectElement = selectQuery<HTMLSelectElement>(
    "select#css-radial-shape",
    radialCssOption
  );

  shapeSelectElement.addEventListener("change", (e: Event) => {
    const select = e.target as HTMLSelectElement;
    gradientInfos.options.css.radial.shape = select.value as
      | "circle"
      | "ellipse";
  });

  const sizeSelectElement = selectQuery<HTMLSelectElement>(
    "select#css-radial-size",
    radialCssOption
  );
  sizeSelectElement.addEventListener("change", (e: Event) => {
    const select = e.target as HTMLSelectElement;
    gradientInfos.options.css.radial.size = select.value as
      | "closest-side"
      | "closest-corner"
      | "farthest-side"
      | "farthest-corner";
  });

  const radialGradientOffsetsPicker = selectQuery<HTMLDivElement>(
    "position-picker",
    radialCssOption
  );

  createMutationObserver(
    radialGradientOffsetsPicker,
    ["x", "y"],
    (attribute: string, mutation: MutationRecord) => {
      gradientInfos.options.css.radial[
        mutation.attributeName
      ] = `${attribute}%`;
    }
  );

  const conicCssOption: HTMLDivElement = cssGradientOptions[2];

  const conicGradientOffsetPicker = selectQuery<HTMLElement>(
    "position-picker",
    conicCssOption
  );
  createMutationObserver(
    conicGradientOffsetPicker,
    ["x", "y"],
    (attribute: string, mutation: MutationRecord) => {
      gradientInfos.options.css.conic[mutation.attributeName] = `${attribute}%`;
    }
  );

  const conicGradientAnglePicker = selectQuery<HTMLElement>(
    "angle-picker",
    conicCssOption
  );

  createMutationObserver(
    conicGradientAnglePicker,
    ["angle"],
    (attribute: string) => {
      gradientInfos.options.css.conic.orientation = Number(attribute);
    }
  );

  const commonCssOption: HTMLDivElement = cssGradientOptions[3];
  const isRepeatingCheckbox = selectQuery(
    "input[type=checkbox]",
    commonCssOption
  );

  isRepeatingCheckbox.addEventListener("change", (e: Event) => {
    const checkbox = e.target as HTMLInputElement;

    gradientInfos.options.css.common.isRepeating = checkbox.checked;
  });
  // Add observers for radial and conic options as needed using createMutationObserver function.
}

const dialogElement = selectQuery<HTMLDialogElement>("dialog#transform-dialog");
const chosenTransformsFormElement = selectFirstByClass<HTMLFormElement>(
  "menu__options-svg--common-chosen-transforms"
);

const transformFieldSetsArray = selectByClass<HTMLFieldSetElement>(
  "menu__options-svg--common-transform",
  chosenTransformsFormElement
);

export function addSvgOptionsListeners() {
  const transformFunctionCheckboxes = selectQueryAll<HTMLInputElement>(
    "input[type=checkbox]",
    dialogElement
  );

  for (const checkbox of transformFunctionCheckboxes) {
    checkbox.addEventListener("change", (e: Event) => {
      const checkbox = e.currentTarget as HTMLInputElement;

      const label = getParent<HTMLLabelElement>(checkbox);

      const transformFunction: string = label.innerText;

      log("Checkbox change on:", transformFunction);

      const fieldSetToModify: HTMLFieldSetElement =
        transformFieldSetsArray.find((fieldSet: HTMLFieldSetElement) => {
          const dataAttributeFunction: string = fieldSet.dataset.transform;
          return transformFunction === dataAttributeFunction;
        });

      const transformObject = getTransformValues(fieldSetToModify);
      const hasNowChosenFunction: boolean = checkbox.checked;
      if (hasNowChosenFunction) {
        removeClass(fieldSetToModify, "hide");

        addTransformToGradientInfos(transformObject);
      } else {
        addClass(fieldSetToModify, "hide");

        deleteTransformToGradientInfos(transformObject);
      }
    });
  }
  const svgGradientOptions = selectQueryAll<HTMLDivElement>(
    `.menu__options--svg>*`
  );

  const linearGradientOptions: HTMLDivElement = svgGradientOptions[0];
  const svgLinearGradientAnglePicker = selectQuery(
    "angle-picker",
    linearGradientOptions
  );

  svgLinearGradientAnglePicker.addEventListener(
    "custom:angle-change",
    (e: CustomEvent) => {
      gradientInfos.options.svg.linear.orientation = e.detail.angle;
    }
  );

  const radialGradientOptions: HTMLDivElement = svgGradientOptions[1];

  const [circlePositionPicker, focalPositionPicker] =
    selectQueryAll<HTMLElement>("position-picker", radialGradientOptions);

  createMutationObserver(
    circlePositionPicker,
    ["x", "y"],
    (attribute: string, mutation: MutationRecord) => {
      const radialPositionProperty: string =
        mutation.attributeName === "x" ? "centerX" : "centerY";

      gradientInfos.options.svg.radial[
        radialPositionProperty
      ] = `${attribute}%`;
    }
  );

  createMutationObserver(
    focalPositionPicker,
    ["x", "y"],
    (attribute: string, mutation: MutationRecord) => {
      const radialPositionProperty: string =
        mutation.attributeName === "x" ? "focalX" : "focalY";

      gradientInfos.options.svg.radial[
        radialPositionProperty
      ] = `${attribute}%`;
    }
  );

  const commonGradientOptions: HTMLDivElement = svgGradientOptions[2];

  const gradientUnitsSelect = selectQuery<HTMLSelectElement>(
    "select#svg-gradient-units",
    commonGradientOptions
  );

  gradientUnitsSelect.addEventListener("change", (e: Event) => {
    const select = e.currentTarget as HTMLSelectElement;
    gradientInfos.options.svg.common.gradientUnits = select.value as
      | "userSpaceOnUse"
      | "objectBoundingBox";
  });

  const gradientTransformAddButton = selectFirstByClass<HTMLButtonElement>(
    "menu__options-add-transform-button"
  );

  gradientTransformAddButton.addEventListener("click", (e: MouseEvent) => {
    dialogElement.showModal();
    addClass(dialogElement, "fade-in");

    setTimeout(() => {
      removeClass(dialogElement, "fade-in");
    }, 300);
  });
  const closeModalButton = selectQuery<HTMLButtonElement>(
    "button#close-dialog",
    dialogElement
  );

  closeModalButton.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();

    addClass(dialogElement, "fade-out");

    setTimeout(() => {
      dialogElement.close();
      removeClass(dialogElement, "fade-out");
    }, 300);
  });

  const spreadMethodSelect = selectQuery<HTMLSelectElement>(
    "select#svg-spread-method",
    commonGradientOptions
  );

  spreadMethodSelect.addEventListener("change", (e: Event) => {
    const select = e.currentTarget as HTMLSelectElement;

    gradientInfos.options.svg.common.spreadMethod = select.value as
      | "pad"
      | "reflect"
      | "repeat";
  });
}

export function addCanvasOptionsListeners() {
  const canvasGradientOptions = selectQueryAll<HTMLDivElement>(
    `.menu__options--canvas>*`
  );

  const linearGradientOptions: HTMLDivElement = canvasGradientOptions[0];
  const radialGradientOptions: HTMLDivElement = canvasGradientOptions[1];
  const conicGradientOptions: HTMLDivElement = canvasGradientOptions[2];
  const commonGradientOptions: HTMLDivElement = canvasGradientOptions[3];
}
