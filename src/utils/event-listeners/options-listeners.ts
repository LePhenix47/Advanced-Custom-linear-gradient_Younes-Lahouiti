import { log } from "@utils/helpers/console.helpers";
import {
  selectQueryAll,
  selectQuery,
  getAttributeFrom,
} from "@utils/helpers/dom.helpers";
import { gradientInfos } from "@utils/variables/global-states/gradient-infos";

export function createMutationObserver(
  element: HTMLElement,
  properties: string[],
  callback: (attribute: string, mutationRecord: MutationRecord) => void
) {
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
    "select",
    radialCssOption
  );

  shapeSelectElement.addEventListener("change", (e: Event) => {
    const select = e.target as HTMLSelectElement;
    gradientInfos.options.css.radial.shape = select.value as
      | "circle"
      | "ellipse";
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

export function addSvgOptionsListeners() {
  const svgGradientOptions =
    selectQueryAll<HTMLDivElement>(`.menu__options--svg`);

  log(svgGradientOptions);
}

export function addCanvasOptionsListeners() {
  const canvasGradientOptions = selectQueryAll<HTMLDivElement>(
    `.menu__options--canvas`
  );

  log(canvasGradientOptions);
}
