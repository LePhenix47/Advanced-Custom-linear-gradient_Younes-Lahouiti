import "@components/index.components";
import {
  addNewRowEntry,
  setTableRowsByDelegation,
} from "@utils/event-listeners/table-event-listeners";
import { assert, dir, log, table } from "@utils/helpers/console.helpers";
import {
  addClass,
  getAttributeFrom,
  getChildren,
  getClone,
  removeClass,
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
import {
  addCssOptionsListeners,
  addSvgOptionsListeners,
  addCanvasOptionsListeners,
} from "@utils/event-listeners/options-listeners";
import CSSLinearGradient, {
  CSSLinearGradientColorStop,
} from "@utils/classes/states/css-gradients/linear/css-linear.class";
import SVGLinearGradient from "@utils/classes/states/svg-gradients/linear/svg-linear.class";
import CanvasLinearGradient from "@utils/classes/states/canvas-gradients/linear/canvas-linear.class";
import CanvasRadialGradient from "@utils/classes/states/canvas-gradients/radial/canvas-radial.class";
import CSSRadialGradient, {
  CSSRadialGradientColorStop,
} from "@utils/classes/states/css-gradients/radial/css-radial.class";
import SVGRadialGradient from "@utils/classes/states/svg-gradients/radial/svg-radial.class";
import CSSConicGradient, {
  CSSConicGradientColorStop,
} from "@utils/classes/states/css-gradients/conic/css-conic.class";
import CanvasConicGradient from "@utils/classes/states/canvas-gradients/conic/canvas-conic.class";
import { CSSGradientColorStop } from "@utils/classes/states/css-gradients/class-base/css-gradient-base.class";
import { createCssGradient } from "@utils/event-listeners/gradient-functions";

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

const canvas = selectFirstByClass<HTMLCanvasElement>("index__canvas-gradient");

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
const cssGradientBackgroundElement = selectFirstByClass<HTMLDivElement>(
  "index__css-gradient"
);

const svgGradientBackgroundElement = selectFirstByClass<HTMLDivElement>(
  "index__svg-gradient"
);

generateGradientButton.addEventListener("click", (e: MouseEvent) => {
  const { language } = gradientInfos;
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
      break;
    }
    case "svg": {
      // const svgGradient:string = createSvgGradient();
      break;
    }
    case "canvas": {
      // const canvasGradient = createCanvasGradient();
      break;
    }

    default:
      break;
  }
});
