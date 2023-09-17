import { selectFirstByClass } from "@utils/helpers/dom.helpers";
import {
  jsClasses,
  cssReset,
  lightThemeVariables,
  darkThemeVariables,
} from "@utils/variables/types/web-component.variables";

const templateElement = document.createElement("template");

const templateStyle: string = /* css */ `
.picker__container {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
.picker__containers {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.picker__label {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  text-align: right;

  padding: 5px;
}

.picker__input {
   background-color: transparent;
   border: 2px solid var(--col-tertiary);
   border-radius: 5px;
   width: 50px;
   font-size: 16px;
}

.picker__canvas {
  --_canvas-size: 200px;

  border: 2px solid var(--col-tertiary);
  width: var(--_canvas-size);
  aspect-ratio: 1/1;
  max-width: var(--_canvas-size);
  min-width: var(--_canvas-size);

  border-radius: 5px;
}
`;
const templateContent: string = /*html */ `
<div class="picker__container">
  <h2 class="picker__title">Offsets</h2>

  <div class="picker__inputs">
    <div class="picker__input">
      <label for="x-offset" class="picker__label">X offset</label>
      <span class="picker__unit">%</span>
      <input type="number" class="picker__input-field" id="x-offset" value="50" min="0" max="100" />
    </div>

    <div class="picker__input">
      <label for="y-offset" class="picker__label">Y offset</label>
      <span class="picker__unit">%</span>
      <input type="number" class="picker__input-field" id="y-offset" value="50" min="0" max="100" />
    </div>
  </div>
  <canvas class="picker__canvas" width="200" height="200"></canvas>
</div>
`;

templateElement.innerHTML = /*html */ `
<!-- CSS Style -->
  <style>
    ${jsClasses}
    ${cssReset}
    ${lightThemeVariables}
    ${darkThemeVariables}

    /* Actual CSS style for the web component*/
    ${templateStyle}
  </style>

  <!-- HTML Content -->
  ${templateContent}
`;

class PositionPicker extends HTMLElement {
  animationId: number;
  canvas: HTMLCanvasElement;
  constructor() {
    super();
    //We create the cotnainer that holds the web component
    const shadowRoot = this.attachShadow({ mode: "open" });

    //We clone the template
    const clonedTemplate = templateElement.content.cloneNode(true);
    //We add it as a child of our web component
    shadowRoot.appendChild(clonedTemplate);

    this.animationId = NaN;

    this.animateCanvas = this.animateCanvas.bind(this);
  }

  static get observedAttributes() {
    //We indicate the list of attributes that the custom element wants to observe for changes.
    return ["x", "y", "title"];
  }

  get x() {
    return Number(this.getAttribute("x"));
  }

  set x(newValue: number) {
    const stringifiedValue: string = newValue.toString();
    this.setAttribute("x", stringifiedValue);
  }

  get y() {
    return Number(this.getAttribute("y"));
  }

  set y(newValue: number) {
    const stringifiedValue: string = newValue.toString();
    this.setAttribute("y", stringifiedValue);
  }

  get title() {
    return this.getAttribute("title");
  }
  set title(newTitle: string) {
    this.setAttribute("title", newTitle);
  }

  // The canvas methods will need to bind the "this" keyword

  setCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  animateCanvas() {
    try {
      this.animationId = requestAnimationFrame(this.animateCanvas);
    } catch (error) {
      console.error("Stopped the canvas animation", error);
      this.cancelAnimation();
    }
  }

  cancelAnimation() {
    cancelAnimationFrame(this.animationId);
  }

  connectedCallback() {
    const container = selectFirstByClass<HTMLDivElement>(
      "picker__container",
      this.shadowRoot
    );

    const canvas = selectFirstByClass<HTMLCanvasElement>(
      "canvas",
      this.shadowRoot
    );

    this.canvas = canvas;

    this.animateCanvas();
  }

  disconnectedCallback() {
    this.cancelAnimation();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title": {
        //…
        break;
      }
      default:
        break;
    }
  }
}

customElements.define("position-picker", PositionPicker);
