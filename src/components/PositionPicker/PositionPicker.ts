import OffsetCreator from "@utils/classes/services/position-picker-service.class";
import {
  handlePointerMoveFromElement,
  handlePointerUpDown,
} from "@utils/event-listeners/pointer-infos-listeners";
import { log } from "@utils/helpers/console.helpers";
import { selectFirstByClass, selectQuery } from "@utils/helpers/dom.helpers";
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
  flex-direction: column;
  gap: 15px;
}

.picker__containers {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.picker{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

.picker__outputs {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.picker__output-container {
   background-color: transparent;
   border: 2px solid var(--bg-tertiary);
   border-radius: 5px;
   width: 50px;
   font-size: 16px;
}

.picker__canvas {
  --_canvas-size: 100px;

  border: 2px solid var(--bg-tertiary);
  width: var(--_canvas-size);
  height: var(--_canvas-size);

  border-radius: 5px;
}
`;
const templateContent: string = /*html */ `
<div class="picker__container">
  <h2 class="picker__title">Offsets</h2>

  <div class="picker">

    <div class="picker__outputs">
      <div class="picker__output-container">
        <label for="x-offset" class="picker__label">X offset</label>
        <output class="picker__output-field" id="x-offset" value="50" min="0" max="100" >50</output>
        <span class="picker__unit">%</span>
      </div>
  
      <div class="picker__output-container">
        <label for="y-offset" class="picker__label">Y offset</label>
        <output class="picker__output-field" id="y-offset" value="50" min="0" max="100" >50</output>
        <span class="picker__unit">%</span>
      </div>
    </div>
    
    <canvas class="picker__canvas" width="200" height="200"></canvas>
  </div>
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
  pointerInfos: { x: number; y: number; isPressing: boolean };

  effectHandler: OffsetCreator | null;
  ctx: CanvasRenderingContext2D;
  constructor() {
    super();
    //We create the cotnainer that holds the web component
    const shadowRoot = this.attachShadow({ mode: "open" });

    //We clone the template
    const clonedTemplate = templateElement.content.cloneNode(true);
    //We add it as a child of our web component
    shadowRoot.appendChild(clonedTemplate);

    /*
    // Class variables
    */
    this.animationId = NaN;

    this.pointerInfos = {
      x: NaN,
      y: NaN,
      isPressing: false,
    };

    this.effectHandler;

    this.canvas;
    this.ctx;

    // Binds
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.animationId = requestAnimationFrame(this.animateCanvas);

      this.effectHandler.updateTrackerCoords();
      this.effectHandler.trackPointer();
    } catch (error) {
      console.error("Stopped the canvas animation", error);
      this.cancelAnimation();
    }
  }

  cancelAnimation() {
    cancelAnimationFrame(this.animationId);
  }

  connectedCallback() {

    const container = selectQuery<HTMLDivElement>(
      ".picker__container",
      this.shadowRoot
    );
    container.addEventListener("pointerup", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    container.addEventListener("pointerdown", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    container.addEventListener("pointermove", (e: PointerEvent) => {
      handlePointerMoveFromElement(e, this.pointerInfos, this.canvas);

      const { x: percentageX, y: percentageY } =
        this.effectHandler.getOffsets(true);

      this.x = percentageX;
      this.y = percentageY;
    });

    const titleElement = selectQuery<HTMLTitleElement>(
      ".picker__title",
      this.shadowRoot
    );
    titleElement.textContent = this.title;

    const canvas = selectQuery<HTMLCanvasElement>("canvas", this.shadowRoot);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false; // Disable smoothing for pixel-perfect rendering

    this.setCanvasSize(100, 100);

    this.effectHandler = new OffsetCreator(this.canvas, this.pointerInfos);

    this.animateCanvas();
  }

  disconnectedCallback() {
    this.cancelAnimation();

    const container = selectQuery<HTMLDivElement>(
      ".picker__container",
      this.shadowRoot
    );
    container.removeEventListener("pointerup", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    container.removeEventListener("pointerdown", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    container.removeEventListener("pointermove", (e: PointerEvent) => {
      handlePointerMoveFromElement(e, this.pointerInfos, this.canvas);

      const { x: percentageX, y: percentageY } =
        this.effectHandler.getOffsets(true);

      this.x = percentageX;
      this.y = percentageY;
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string
  ) {
    const titleElement = selectQuery<HTMLTitleElement>(
      ".picker__title",
      this.shadowRoot
    );

    const outputXElement = selectQuery<HTMLOutputElement>(
      "output#x-offset",
      this.shadowRoot
    );
    const outputYElement = selectQuery<HTMLOutputElement>(
      "output#y-offset",
      this.shadowRoot
    );

    switch (name) {
      case "x": {
        outputXElement.textContent = newValue;
        //…
        break;
      }
      case "y": {
        outputYElement.textContent = newValue;
        //…
        break;
      }
      case "title": {
        //…
        titleElement.textContent = newValue;
        break;
      }
      default:
        break;
    }
  }
}

customElements.define("position-picker", PositionPicker);
