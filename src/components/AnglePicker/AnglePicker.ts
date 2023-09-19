import {
  calculateAngle,
  calculateMouseCoordsFromCenter,
  handlePointerUpDown,
} from "@utils/event-listeners/pointer-infos-listeners";
import { log } from "@utils/helpers/console.helpers";
import {
  getClassListValues,
  selectFirstByClass,
  selectQuery,
  setStyleProperty,
} from "@utils/helpers/dom.helpers";
import { PointerInfosType } from "@utils/variables/global-states/pointer-infos";
import {
  jsClasses,
  cssReset,
  lightThemeVariables,
  darkThemeVariables,
} from "@utils/variables/types/web-component.variables";

const templateElement = document.createElement("template");

const templateStyle: string = /* css */ `

button {
  border-color: transparent;
  background-color: transparent;
  font-family: inherit;
  color: inherit;
}
button:hover {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
}

.menu__orientation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-block: 15px;
  gap: 15px;
}
.menu__angle-picker {
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid currentColor;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
}
.menu__angle-picker--center-dot {
  content: "";
  aspect-ratio: 1;
  border-radius: 50%;
  position: absolute;
  translate: -50% -50%;
  inset: 50%;
  height: 5px;
  background-color: currentColor;
}
.menu__angle-picker--marker {
  position: absolute;
  height: var(--_size);
  aspect-ratio: 1/2;
  top: var(--_top);
  left: var(--_left);
  translate: -50% -50%;
  rotate: var(--_initial-degrees);
  border-bottom-left-radius: 100vmax;
  border-bottom-right-radius: 100vmax;
  background-color: currentColor;
}
.menu__angle-picker--marker:nth-child(odd) {
  scale: 75%;
}
.menu__angle-picker--marker-0-deg {
  --_size: 8px;
  --_initial-degrees: 0deg;
  --_degrees: -90deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-45-deg {
  --_size: 8px;
  --_initial-degrees: 45deg;
  --_degrees: -45deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-90-deg {
  --_size: 8px;
  --_initial-degrees: 90deg;
  --_degrees: 0deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-135-deg {
  --_size: 8px;
  --_initial-degrees: 135deg;
  --_degrees: 45deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-180-deg {
  --_size: 8px;
  --_initial-degrees: 180deg;
  --_degrees: 90deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-225-deg {
  --_size: 8px;
  --_initial-degrees: 225deg;
  --_degrees: 135deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-270-deg {
  --_size: 8px;
  --_initial-degrees: 270deg;
  --_degrees: 180deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--marker-315-deg {
  --_size: 8px;
  --_initial-degrees: 315deg;
  --_degrees: 225deg;
  --_offset: 44px;
  --_top: calc(50% + var(--_offset) * sin(var(--_degrees)));
  --_left: calc(50% + var(--_offset) * cos(var(--_degrees)));
}
.menu__angle-picker--rotator {
  --_rotation: 0deg;
  rotate: var(--_rotation);
  position: absolute;
  top: 0%;
  left: 50%;
  height: 50%;
  width: 1px !important;
  background-color: #b6b5b5;
  translate: -50% 0%;
  transform-origin: center bottom;
}
.menu__angle-picker--rotator::before {
  content: "";
  position: absolute;
  top: 0%;
  left: 0%;
  translate: -50% -50%;
  background-color: var(--color-secondary);
  height: 10px;
  outline: 2px solid var(--color-tertiary);
  aspect-ratio: 1;
  border-radius: 50%;
}
`;
const templateContent: string = /*html */ `
<section class="menu__orientation">

  <div class="menu__angle-picker">
    <!-- Center point for the circle -->
    <div class="menu__angle-picker--center-dot"></div>

    <!-- Angles markers -->
    <div class="menu__angle-picker--marker menu__angle-picker--marker-0-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-45-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-90-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-135-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-180-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-225-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-270-deg"></div>
    <div class="menu__angle-picker--marker menu__angle-picker--marker-315-deg"></div>

    <!-- Button to set the orientation in degrees in JS -->
    <button class="menu__angle-picker--rotator"></button>
  </div>
  <!-- The number input is only for mobile devices  -->
  <div class="menu__angle-result">
    <label for="orientation">Current value:</label>
    <output for="orientation" class="menu__orientation-output">0°</output>
  </div>
</section>
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

class AnglePicker extends HTMLElement {
  pointerInfos: { x: number; y: number; isPressing: boolean };
  constructor() {
    super();
    //We create the container that holds the web component
    const shadowRoot = this.attachShadow({ mode: "open" });

    //We clone the template
    const clonedTemplate = templateElement.content.cloneNode(true);
    //We add it as a child of our web component
    shadowRoot.appendChild(clonedTemplate);

    //
    this.pointerInfos = {
      x: NaN,
      y: NaN,
      isPressing: false,
    };
  }

  static get observedAttributes() {
    //We indicate the list of attributes that the custom element wants to observe for changes.
    return ["angle"];
  }

  get angle(): number {
    const angleAsString: string = this.getAttribute("angle");
    return Number(angleAsString);
  }

  set angle(newAngle: number) {
    const angleAsString: string = newAngle.toString();
    this.setAttribute("angle", angleAsString);
  }

  connectedCallback() {
    const anglePickerContainer = selectQuery<HTMLDivElement>(
      ".menu__orientation",
      this.shadowRoot
    );

    anglePickerContainer.addEventListener("pointerup", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    anglePickerContainer.addEventListener("pointerdown", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });

    const centerDotElement = selectQuery<HTMLDivElement>(
      ".menu__angle-picker--center-dot",
      this.shadowRoot
    );

    anglePickerContainer.addEventListener("pointermove", (e: PointerEvent) => {
      const { mouseX, mouseY } = calculateMouseCoordsFromCenter(
        e,
        centerDotElement
      );

      const angle: number = calculateAngle(mouseX, mouseY);

      const { isPressing } = this.pointerInfos;
      if (isPressing) {
        this.angle = angle;
      }
    });

    const anglePicker = selectQuery<HTMLDivElement>(
      ".menu__angle-picker",
      this.shadowRoot
    );

    anglePicker.addEventListener("click", (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement;

      const clickedContainerItself = clickedElement === anglePicker;
      if (clickedContainerItself) {
        return;
      }

      const elementClasses: string[] = getClassListValues(clickedElement);

      const isAngleMarker: boolean = elementClasses.includes(
        "menu__angle-picker--marker"
      );

      if (isAngleMarker) {
        log("clicked angle marker!", elementClasses);

        const digitsString: RegExp = /\d+/g;
        const degrees: number = Number(
          elementClasses[1].match(digitsString)[0]
        );

        this.angle = degrees;
        log({ degrees });
      }
    });
  }

  disconnectedCallback() {
    const anglePickerContainer = selectQuery<HTMLDivElement>(
      ".menu__orientation",
      this.shadowRoot
    );

    anglePickerContainer.removeEventListener("pointerup", (e: PointerEvent) => {
      handlePointerUpDown(e, this.pointerInfos);
    });
    anglePickerContainer.removeEventListener(
      "pointerdown",
      (e: PointerEvent) => {
        handlePointerUpDown(e, this.pointerInfos);
      }
    );

    const centerDotElement = selectQuery<HTMLDivElement>(
      ".menu__angle-picker--center-dot",
      this.shadowRoot
    );

    const buttonRotatorElement = selectQuery<HTMLButtonElement>(
      ".menu__angle-picker--rotator",
      this.shadowRoot
    );

    const outputElement = selectQuery<HTMLOutputElement>(
      ".menu__orientation-output",
      this.shadowRoot
    );
    anglePickerContainer.removeEventListener(
      "pointermove",
      (e: PointerEvent) => {
        const { mouseX, mouseY } = calculateMouseCoordsFromCenter(
          e,
          centerDotElement
        );

        const angle: number = calculateAngle(mouseX, mouseY);

        const { isPressing } = this.pointerInfos;
        if (isPressing) {
          setStyleProperty("--_rotation", `${angle}deg`, buttonRotatorElement);
          outputElement.textContent = `${angle}°`;
        }
      }
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "angle": {
        const buttonRotatorElement = selectQuery<HTMLButtonElement>(
          ".menu__angle-picker--rotator",
          this.shadowRoot
        );

        const outputElement = selectQuery<HTMLOutputElement>(
          ".menu__orientation-output",
          this.shadowRoot
        );
        setStyleProperty("--_rotation", `${newValue}deg`, buttonRotatorElement);
        outputElement.textContent = `${newValue}°`;

        //…
        break;
      }
      default:
        break;
    }
  }
}

customElements.define("angle-picker", AnglePicker);

// function setAngleToPicker(e: PointerEvent, pointerInfos: PointerInfosType) {
//   const centerDot = selectQuery<HTMLDivElement>(
//     ".menu__angle-picker--center-dot"
//   );
//   const centerDotRect: DOMRect = centerDot.getBoundingClientRect();

//   const mouseX: number = e.x - centerDotRect.x;
//   const mouseY: number = centerDotRect.y - e.y; // The inversion is needed here because JS uses the SVG coords system

//   const angle: number = calculateAngle(mouseX, mouseY);

//   // console.log(`${angle}deg`);

// const { isPressing } = pointerInfos;
// if (isPressing) {
//   setStyleProperty("--_rotation", `${angle}deg`, btn);
//   orientationOutput.textContent = `${angle}°`;
// }
// }
