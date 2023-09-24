import "@components/index.components";
import {
  addNewRowEntry,
  setTableRowsByDelegation,
} from "@utils/event-listeners/table-event-listeners";
import { assert, log, table } from "@utils/helpers/console.helpers";
import {
  getAttributeFrom,
  getChildren,
  getClone,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
  setStyleProperty,
} from "@utils/helpers/dom.helpers";

import { handleContainerDraggingElementDragOver } from "@utils/event-listeners/drag-n-drop-listeners";
import Gradient, {
  GradientReturnType,
} from "@utils/classes/states/index-gradients.class";
import { CSSGradientReturnType } from "@utils/classes/states/css-gradients/index-css.class";
import {
  switchGradientTypes,
  switchLanguage,
} from "@utils/event-listeners/language-switch-listeners";
import { gradientInfos } from "@utils/variables/global-states/gradient-infos";

const addButton = selectQuery<HTMLButtonElement>(".menu__add-color-button");
addButton.addEventListener("click", addNewRowEntry);

const tableBody =
  selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

tableBody.addEventListener("click", setTableRowsByDelegation);
tableBody.addEventListener("dragover", handleContainerDraggingElementDragOver);

const mutationObserver = new MutationObserver(
  (mutationList: MutationRecord[], observer: MutationObserver) => {
    for (const mutation of mutationList) {
      const attribute: string = getAttributeFrom(
        mutation.attributeName,
        mutation.target as HTMLElement
      );

      const hasChangedValue: boolean = mutation.oldValue !== attribute;

      if (hasChangedValue) {
        log(
          `The ${mutation.attributeName} attribute was modified to ${attribute}`
        );

        log(`Previous value: ${mutation.oldValue}`);
      }
    }
  }
);

const positionPicker = selectQuery<HTMLElement>("position-picker");
log(positionPicker);

mutationObserver.observe(positionPicker, {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["x", "y"],
});

const languageSelectElement =
  selectQuery<HTMLSelectElement>("#creation-language");

languageSelectElement.addEventListener("change", switchLanguage);

function addEventListenersToGradientTypes() {
  const gradientTypesContainer = selectFirstByClass<HTMLDivElement>(
    "menu__gradient-types--inputs"
  );

  const gradientTypesElements: HTMLDivElement[] = getChildren(
    gradientTypesContainer
  );

  for (const gradientType of gradientTypesElements) {
    const radioInputs = selectQueryAll<HTMLInputElement>(
      "input[type=radio]",
      gradientType
    );

    for (const radioInput of radioInputs) {
      radioInput.addEventListener("change", switchGradientTypes);
    }
  }
}
addEventListenersToGradientTypes();

const canvas = selectFirstByClass<HTMLCanvasElement>("index__canvas-gradient");

window.addEventListener("resize", handleCanvasResize);
function handleCanvasResize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
handleCanvasResize();

const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

export const linearGradients = {
  css: new Gradient().create("css", "linear"),
  svg: new Gradient().create("svg", "linear"),
  canvas: new Gradient().create("canvas", "linear", ctx),
};

export const radialGradients = {
  css: new Gradient().create("css", "radial"),
  svg: new Gradient().create("svg", "radial"),
  canvas: new Gradient().create("canvas", "radial", ctx),
};

export const conicGradients = {
  css: new Gradient().create("css", "conic"),
  canvas: new Gradient().create("canvas", "conic", ctx),
};

log({ linearGradients });
log({ radialGradients });
log({ conicGradients });

// setInterval(() => {
//   table(gradientInfos.stopColors);
// }, 2_000);
