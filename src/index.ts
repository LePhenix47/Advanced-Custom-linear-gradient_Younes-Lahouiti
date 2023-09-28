/*
  This code's rather messy
*/

import "@components/index.components";
import {
  addNewRowEntry,
  setTableRowsByDelegation,
} from "@utils/event-listeners/table-event-listeners";
import { log } from "@utils/helpers/console.helpers";
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

export const linearGradients = {
  svg: new Gradient().create("svg", "linear") as SVGLinearGradient,
  canvas: new Gradient().create(
    "canvas",
    "linear",
    ctx
  ) as CanvasLinearGradient,
};

export const radialGradients = {
  svg: new Gradient().create("svg", "radial") as SVGRadialGradient,
  canvas: new Gradient().create(
    "canvas",
    "radial",
    ctx
  ) as CanvasRadialGradient,
};

export const conicGradients = {
  css: new Gradient().create("css", "conic") as CSSConicGradient,
  canvas: new Gradient().create("canvas", "conic", ctx) as CanvasConicGradient,
};

setInterval(() => {
  // table(gradientInfos.stopColors);
  log(gradientInfos);
}, 1_500);

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
      const svgGradient = createSvgGradient();
      const { html, reactNative } = svgGradient;

      log(html);
      log(reactNative);
      svgGradientBackgroundElement.innerHTML = html;
      menuGradientCode.textContent = html;

      break;
    }
    case "canvas": {
      const canvasGradient = createCanvasGradient(canvas);
      const { code, gradient } = canvasGradient;

      log(code);
      log(gradient);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      menuGradientCode.textContent = code;

      break;
    }

    default:
      break;
  }
});
