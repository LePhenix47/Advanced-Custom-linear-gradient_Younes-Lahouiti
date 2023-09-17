import {
  jsClasses,
  cssReset,
  lightThemeVariables,
  darkThemeVariables,
} from "@utils/variables/types/web-component.variables";

const templateElement = document.createElement("template");

const templateStyle: string = /* css */ `
`;
const templateContent: string = /*html */ `
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
  constructor() {
    super();
    //We create the cotnainer that holds the web component
    const shadowRoot = this.attachShadow({ mode: "open" });

    //We clone the template
    const clonedTemplate = templateElement.content.cloneNode(true);
    //We add it as a child of our web component
    shadowRoot.appendChild(clonedTemplate);
  }

  static get observedAttributes() {
    //We indicate the list of attributes that the custom element wants to observe for changes.
    return [];
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "": {
        //…
        break;
      }
      default:
        break;
    }
  }
}

customElements.define("angle-picker", AnglePicker);
