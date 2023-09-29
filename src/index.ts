/*
  This code's rather messy
*/

import "@components/index.components";
import {
  addNewRowEntry,
  setTableRowsByDelegation,
} from "@utils/event-listeners/table-event-listeners";
import { log, table } from "@utils/helpers/console.helpers";
import {
  addClass,
  getChildren,
  removeClass,
  selectFirstByClass,
  selectQuery,
  selectQueryAll,
  setStyleProperty,
} from "@utils/helpers/dom.helpers";

import { handleContainerDraggingElementDragOver } from "@utils/event-listeners/drag-n-drop-listeners";
import Gradient from "@utils/classes/states/index-gradients.class";
import {
  switchGradientTypes,
  switchLanguage,
} from "@utils/event-listeners/language-switch-listeners";
import { gradientInfos } from "@utils/variables/global-states/gradient-infos";
import {
  addCssOptionsListeners,
  addSvgOptionsListeners,
  addCanvasOptionsListeners,
} from "@utils/event-listeners/options-listeners";
import SVGLinearGradient from "@utils/classes/states/svg-gradients/linear/svg-linear.class";
import CanvasLinearGradient from "@utils/classes/states/canvas-gradients/linear/canvas-linear.class";
import CanvasRadialGradient from "@utils/classes/states/canvas-gradients/radial/canvas-radial.class";
import SVGRadialGradient from "@utils/classes/states/svg-gradients/radial/svg-radial.class";
import CSSConicGradient from "@utils/classes/states/css-gradients/conic/css-conic.class";
import CanvasConicGradient from "@utils/classes/states/canvas-gradients/conic/canvas-conic.class";
import {
  createCanvasGradient,
  createCssGradient,
  createSvgGradient,
} from "@utils/event-listeners/gradient-functions";
import { copyTextToClipBoard } from "@utils/helpers/string.helpers";

const menuToggleLabel = selectFirstByClass<HTMLLabelElement>(
  "index__menu-opener-label"
);

menuToggleLabel.addEventListener("click", (e: MouseEvent) => {
  const label = e.currentTarget as HTMLLabelElement;
  const input = selectQuery<HTMLInputElement>("input", label);

  const menuContainer = selectFirstByClass<HTMLElement>(
    "index__menu-container"
  );
  const needsToOpenMenu: boolean = input.checked;
  if (needsToOpenMenu) {
    addClass(menuContainer, "active");
  } else {
    removeClass(menuContainer, "active");
  }
});

const addButton = selectQuery<HTMLButtonElement>(".menu__add-color-button");
addButton.addEventListener("click", addNewRowEntry);

const tableBody =
  selectFirstByClass<HTMLTableSectionElement>("menu__table-body");

tableBody.addEventListener("click", setTableRowsByDelegation);
tableBody.addEventListener("dragover", handleContainerDraggingElementDragOver);

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

export const canvas = selectFirstByClass<HTMLCanvasElement>(
  "index__gradient--canvas"
);

window.addEventListener("resize", handleCanvasResize);
function handleCanvasResize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
handleCanvasResize();

const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

function DEBUG_AND_TEST() {
  setInterval(() => {
    // table(gradientInfos.stopColors);
    log(gradientInfos);
  }, 1_500);

  setTimeout(() => {
    // Set the value property to the value of the option you want to select
    languageSelectElement.selectedIndex = 0; // Replace "optionValue" with the actual value of the option you want to select

    // Create a new "change" event
    const changeEvent = new Event("change", {
      bubbles: true, // Allow the event to bubble up the DOM tree
      cancelable: true, // Allow the event to be canceled
    });

    // Dispatch the "change" event on the <select> element
    languageSelectElement.dispatchEvent(changeEvent);

    const gradientTransformAddButton = selectFirstByClass<HTMLButtonElement>(
      "menu__options-add-transform-button"
    );
    // gradientTransformAddButton.click();
  });
}
DEBUG_AND_TEST();

function addOptionsEventListeners() {
  addCssOptionsListeners();

  addSvgOptionsListeners();

  addCanvasOptionsListeners();
}
addOptionsEventListeners();

const generateGradientButton = selectFirstByClass<HTMLButtonElement>(
  "menu__gradient-generator-button"
);
export const cssGradientBackgroundElement = selectFirstByClass<HTMLDivElement>(
  "index__gradient--css"
);

export const svgGradientBackgroundElement = selectFirstByClass<HTMLDivElement>(
  "index__gradient--svg"
);

const menuGradientCode = selectFirstByClass<HTMLPreElement>(
  "menu__gradient-code"
);

menuGradientCode.addEventListener("click", () => {
  copyTextToClipBoard(menuGradientCode.innerText);
});

generateGradientButton.addEventListener("click", (e: MouseEvent) => {
  const { language } = gradientInfos;
  log("Click");
  switch (language) {
    case "css": {
      const cssGradient: string = createCssGradient();

      // We reset the previous gradient
      setStyleProperty("--_gradient", "none", cssGradientBackgroundElement);
      // We add the new one
      setStyleProperty(
        "--_gradient",
        cssGradient,
        cssGradientBackgroundElement
      );

      menuGradientCode.textContent = cssGradient;
      break;
    }
    case "svg": {
      const { html, reactNative } = createSvgGradient();

      svgGradientBackgroundElement.innerHTML = html;
      menuGradientCode.textContent = !html.length
        ? "Cannot create a gradient with less than 2 stops color hints"
        : html.trim();

      break;
    }
    case "canvas": {
      const { code, gradient } = createCanvasGradient(canvas);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      menuGradientCode.textContent = !code.length
        ? "Cannot create a gradient with less than 2 stops color hints"
        : code.trim();

      break;
    }

    default:
      break;
  }
});
