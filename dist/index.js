(()=>{"use strict";const n=document.createElement("template");n.innerHTML='\n  <style>\n    \n/* \n    Hides the element and all its descendants from view\n */\n.hide {\n    display: none !important;\n}\n\n/* \n    Hides the element from view except for screen readers \n    \n    - Good for accessibilty and by consequence SEO\n*/\n.screen-readers-only {\n    /*    \n    Positions the element off the screen \n    */ \n    clip: rect(0 0 0 0);\n    clip-path: inset(50%);\n\n    /*    \n    Sets the dimensions of the element to 1×1 px \n    */ \n    height: 1px;\n    width: 1px;\n\n    /*    \n    Hides any content that overflows the element \n    */ \n    overflow: hidden;\n\n    /*    \n    Positions the element absolutely \n    */ \n    position: absolute;\n\n    /*    \n    Prevents line breaks in the element \n    */ \n    white-space: nowrap;\n}\n\n/* \n    Disables pointer (click on desktop and tap on mobile) events for the element and its descendants \n*/\n.no-pointer-events {\n    pointer-events: none;\n}\n\n\n    \n@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500;700&display=swap);\n@media(prefers-reduced-motion:reduce) {\n    *, :after, :before {\n        animation: none !important;\n        transition: none !important\n    }\n}\n\n*, :after, :before {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0\n}\n\n::-moz-selection {\n    -webkit-text-stroke: transparent;\n    background-color: var(--selection-bg-color);\n    color: var(--selection-color)\n}\n\n::selection {\n    -webkit-text-stroke: transparent;\n    background-color: var(--selection-bg-color);\n    color: var(--selection-color)\n}\n\nhtml {\n    color-scheme: dark light;\n    scroll-behavior: smooth\n}\n\nbody {\n    background-color: var(--bg-primary);\n    color: var(--color-primary);\n    min-height: 100vh;\n    overflow-x: hidden;\n    transition: background-color .65s ease-in-out, color .35s ease-in-out\n}\n\n:is(ul, ol) {\n    list-style-type: none\n}\n\nbutton {\n    background-color: transparent;\n    border-color: transparent;\n    color: inherit;\n    font-family: inherit\n}\n\nbutton:hover {\n    cursor: pointer\n}\n\nbutton:hover:disabled {\n    cursor: not-allowed\n}\n\ninput {\n    border-color: transparent;\n    font-family: inherit;\n    outline-color: transparent\n}\n\ninput:hover {\n    cursor: pointer\n}\n\ninput:focus {\n    border-color: transparent;\n    outline: transparent\n}\n\ninput:disabled {\n    cursor: not-allowed\n}\n\ntextarea {\n    font-family: inherit\n}\n\ntextarea, textarea:focus {\n    border-color: transparent\n}\n\ntextarea:focus {\n    outline: transparent\n}\n\na {\n    color: inherit;\n    text-decoration: none\n}\n\na:visited {\n    color: currentColor\n}\n\nlabel:hover {\n    cursor: pointer\n}\n\nfieldset {\n    border-color: transparent\n}\n\nlegend {\n    position: static\n}\n\ndialog {\n    inset: 50%;\n    margin: 0;\n    padding: 0;\n    position: fixed;\n    translate: -50% -50%;\n    z-index: 0\n}\n\ndialog, select {\n    border: transparent\n}\n\nselect {\n    font-family: inherit\n}\n\nselect:hover {\n    cursor: pointer\n}\n\noption {\n    font-family: inherit\n}\n\n:is(p, h1, h2, h3, h4, h5, h6, span):empty {\n    display: none !important\n}\ninput[type=text]:hover {\n  cursor: text;\n}\ninput[type=button]:hover {\n  cursor: pointer;\n}\ninput[type=date]:hover {\n  cursor: text;\n}\ninput[type=datetime]:hover {\n  cursor: text;\n}\ninput[type=datetime-local]:hover {\n  cursor: text;\n}\ninput[type=email]:hover {\n  cursor: text;\n}\ninput[type=month]:hover {\n  cursor: text;\n}\ninput[type=week]:hover {\n  cursor: text;\n}\ninput[type=password]:hover {\n  cursor: text;\n}\ninput[type=tel]:hover {\n  cursor: text;\n}\ninput[type=time]:hover {\n  cursor: text;\n}\ninput[type=url]:hover {\n  cursor: text;\n}\ninput[type=submit]:hover {\n  cursor: pointer;\n}\ninput[type=reset]:hover {\n  cursor: pointer;\n}\ninput[type=image]:hover {\n  cursor: pointer;\n}\ninput[type=hidden]:hover {\n  cursor: pointer;\n}\ninput[type=file] {\n  --file-selector-display: initial;\n  --file-selector-width: 80px;\n  --file-selector-height: 21px;\n}\ninput[type=file]:hover {\n  cursor: pointer;\n}\ninput[type=file]::file-selector-button {\n  display: var(--file-selector-display);\n  height: var(--file-selector-height);\n  width: var(--file-selector-width);\n}\ninput[type=color] {\n  background-color: transparent;\n  --color-swatch-display: inline-block;\n  --color-swatch-height: 100%;\n  --color-swatch-border-width: 1px;\n  --color-swatch-border-color: currentColor;\n}\ninput[type=color]:hover {\n  cursor: pointer;\n}\ninput[type=color]::-moz-color-swatch {\n  display: var(--color-swatch-display);\n  height: var(--color-swatch-height);\n  border: var(--color-swatch-border-width) solid var(--color-swatch-border-color);\n}\ninput[type=color]::-webkit-color-swatch {\n  display: var(--color-swatch-display);\n  height: var(--color-swatch-height);\n  border: var(--color-swatch-border-width) solid var(--color-swatch-border-color);\n}\ninput[type=search] {\n  --cancel-button-display: initial;\n  --results-button-display: initial;\n}\ninput[type=search]:hover {\n  cursor: text;\n}\ninput[type=search]::-webkit-search-cancel-button {\n  display: var(--cancel-button-display);\n}\ninput[type=search]::-webkit-search-results-button {\n  display: var(--results-button-display);\n}\ninput[type=number] {\n  --inner-spin-appearance: auto;\n  --outer-spin-appearance: auto;\n  --moz-appearance: initial;\n  /*\n      Ignore the warning, this is to reset the input on Firefox\n      */\n  -moz-appearance: var(--moz-appearance);\n}\ninput[type=number]:hover {\n  cursor: text;\n}\ninput[type=number]::-webkit-inner-spin-button {\n  appearance: var(--inner-spin-appearance);\n}\ninput[type=number]::-webkit-outer-spin-button {\n  appearance: var(--outer-spin-appearance);\n}\ninput[type=range] {\n  border-radius: var(--thumb-border-radius);\n  --track-width: 160px;\n  --track-height: 20px;\n  --track-bg: #e9e9ed;\n  --track-appearance: none;\n  background-color: var(--track-bg);\n  appearance: var(--track-appearance);\n  overflow: hidden;\n  --thumb-appearance: none;\n  --thumb-bg: #484851;\n  --thumb-border-color: white;\n  --thumb-border-width: 0px;\n  --thumb-border-radius: 100vmax;\n  --thumb-width: 15px;\n  --thumb-height: 15px;\n  --inner-track-size: calc(var(--track-width));\n  --inner-track-offset: calc(\n    -1 * var(--track-width) - var(--thumb-width) / 2\n  );\n  --inner-track-bg: #2374ff;\n}\ninput[type=range]:hover {\n  cursor: grab;\n}\ninput[type=range]:active {\n  cursor: grabbing;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n  background-color: var(--track-bg);\n  width: var(--track-width);\n  height: var(--track-bg);\n}\ninput[type=range]::-moz-range-track {\n  background-color: var(--track-bg);\n  width: var(--track-width);\n  height: var(--track-bg);\n}\ninput[type=range]::-webkit-slider-thumb {\n  appearance: var(--thumb-appearance);\n  -webkit-appearance: var(--thumb-appearance);\n  background-color: var(--thumb-bg);\n  color: var(--thumb-bg);\n  border: var(--thumb-border-width) solid var(--thumb-border-color);\n  border-radius: var(--thumb-border-radius);\n  width: var(--thumb-width);\n  height: var(--thumb-height);\n  box-shadow: var(--inner-track-offset) 0 0 var(--inner-track-size) var(--inner-track-bg);\n}\ninput[type=range]::-moz-range-thumb {\n  appearance: var(--thumb-appearance) !important;\n  background-color: var(--thumb-bg);\n  border: var(--thumb-border-width) solid var(--thumb-border-color);\n  border-radius: var(--thumb-border-radius);\n  width: var(--thumb-width);\n  height: var(--thumb-height);\n  box-shadow: var(--inner-track-offset) 0 0 var(--inner-track-size) var(--inner-track-bg);\n}\n\n    \n:host {\n    --bg-primary: rgb(255, 255, 255);\n    --bg-secondary: #f0efef;\n    --bg-tertiary: #676767;\n\n    --semi-transparent-bg: rgba(255, 255, 255, 50%);\n\n    --color-primary: black;\n    --color-secondary: gray;\n\n    --scrollbar-track-bg-color: white;\n\n    --disabled-button-bg: #afafaf;\n\n    --scrollbar-thumb-bg-color: #545454;\n    --scrollbar-thumb-bg-color--hover: #757575;\n    --scrollbar-thumb-bg-color--active: #b0b0b0;\n\n    --selection-bg-color: hwb(240 0% 0%);\n    --selection-color: white;\n}\n\n::backdrop {\n    --backdrop-bg-color: rgba(255, 255, 255, 0.5);\n\n    --scrollbar-track-bg-color: white;\n\n    --scrollbar-thumb-bg-color: #545454;\n    --scrollbar-thumb-bg-color--hover: #757575;\n    --scrollbar-thumb-bg-color--active: #b0b0b0;\n}\n\n    \n@media (prefers-color-scheme: dark) {\n    :host {\n        --bg-primary: black;\n        --bg-secondary: #232323;\n        --bg-tertiary: #7a7a7a;\n\n        --color-primary: white;\n\n        --semi-transparent-bg: rgba(0, 0, 0, 50%);\n\n        --scrollbar-track-bg-color: black;\n        --scrollbar-thumb-bg-color: #ababab;\n        --scrollbar-thumb-bg-color--hover: #8a8a8a;\n        --scrollbar-thumb-bg-color--active: #4f4f4f;\n\n        --selection-bg: #838383;\n        --selection-color: white;\n\n        --selection-bg-color: orange;\n        --selection-color: black;\n    }\n\n\n    ::backdrop {\n        --backdrop-bg-color: rgba(0, 0, 0, 0.5);\n\n        --scrollbar-track-bg-color: black;\n\n        --scrollbar-thumb-bg-color: #ababab;\n        --scrollbar-thumb-bg-color--hover: #8a8a8a;\n        --scrollbar-thumb-bg-color--active: #4f4f4f;\n    }\n}\n\n\n    /* Actual CSS style for the web component*/\n    \n web-component{\n  isolation: isolate;\n  /* Other CSS styles here */\n }\n\n  </style>\n  \n  \n <figure>\n  <slot name="title"></slot>\n  <slot name="image"></slot>\n </figure>\n\n';class e extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"}),t=n.content.cloneNode(!0);e.appendChild(t)}static get observedAttributes(){return[]}connectedCallback(){}disconnectedCallback(){}attributeChangedCallback(n,e,t){n}}customElements.define("web-component",e);const{log:t,error:r,table:o,time:a,timeEnd:i,timeStamp:c,timeLog:s,assert:l,clear:u,count:p,countReset:b,group:d,groupCollapsed:h,groupEnd:m,profile:f,profileEnd:g,trace:y,warn:v,debug:w,info:k,dir:x,dirxml:N}=console;function E(n,e){return function(n,e){if(!e)return Array.from(document.getElementsByClassName(n));const t=e?.tagName?.includes("-");return t?Array.from(e.shadowRoot.getElementsByClassName(n)):Array.from(e.getElementsByClassName(n))}(n,e)[0]}function C(n,e){if(!e)return document.querySelector(n);const t=e?.tagName?.includes("-");return t?e.shadowRoot.querySelector(n):e.querySelector(n)}function A(n,e){if(!e)return Array.from(document.querySelectorAll(n));return e.tagName.includes("-")?Array.from(e.shadowRoot.querySelectorAll(n)):Array.from(e.querySelectorAll(n))}function $(n,e){return n.closest(e)}function _(n,e,t=document.body){const r=e.toString();return t.style.setProperty(n,r)}function S(n,e,t){t.setAttribute(n,e.toString())}function L(n,e){return e.getAttribute(n)}function R(n,e=3){if("number"!=typeof n||"number"!=typeof e)throw new TypeError(`Expected both arguments to be of type number, instead got:\n Number: ${n} of type ${typeof n}\n Float: ${e} of type ${typeof e}\n `);const{isNaN:t}=Number;if(t(n)||t(e))throw new TypeError(`Got NaN number values:\nNumber: ${n} of type ${typeof n}\nFloat: ${e} of type ${typeof e}\n    `);const r=10**e;return Math.trunc(n*r)/r}function z(n){return Number(`0x${n}`)}function T(n){const[e,t,r]=n.map((n=>(n/=255)<=.03928?n/12.92:((n+.055)/1.055)**2.4));return.2126*e+.7152*t+.0722*r}function B(n,e){if("string"!=typeof n||"string"!=typeof e)throw new TypeError(`Invalid arguments, expected string and option to be strings, instead got respective types: ${typeof n} and ${typeof e}`);switch(e.toLowerCase().trim()){case"lowercase":return n.toLowerCase();case"uppercase":return n.toUpperCase();case"titlecase":{const e=n.split(" ");for(let n=0;n<e.length;n++){const t=e[n].charAt(0).toUpperCase(),r=e[n].slice(1).toLowerCase();e[n]=t+r}return e.join(" ")}case"sentencecase":{const e=n.split(/(?<=[.?!])/);for(let n=0;n<e.length;n++){const t=e[n].trim();if(0===t.length){e[n]="";continue}const r=t.charAt(0).toUpperCase(),o=t.slice(1).toLowerCase();e[n]=r+o}return e.join(" ")}default:throw new Error(`Formatting text error, option not available for: ${e}`)}}function I(n){const e=A("tr",n),r=["color","offset","opacity"];for(let n=0;n<e.length;n++){const t=A("td",e[n]),o=n+1;C("p",t[1]).textContent=`${o}.`;for(let n=0;n<r.length;n++){const e=r[n],a=C("label",t[n+2]),i=C("input",t[n+2]),c=`input-${e}-${o}`;S("for",c,a),S("id",c,i)}}t(e)}function P(n,e,r){if(!(n instanceof HTMLInputElement))throw new TypeError("Input parameter must be an input element");if("number"!=typeof e||"number"!=typeof r)throw new TypeError("Invalid min and max values. Both must be numbers");const{isNaN:o}=Number;if(o(e)||o(r))throw new TypeError("Invalid min and max values. Both must not be NaN");if(e>r)throw new RangeError(`Invalid min and max values, min > max: ${e} and max: ${r}`);const a=n.valueAsNumber>r;a&&(n.valueAsNumber=r);const i=n.valueAsNumber<e;i&&(n.valueAsNumber=e),t(a,i)}function q(n,e){let t=function(n){const e="number"!=typeof n,{isNaN:t}=Number,r=t(n);if(e||r)throw new TypeError(e?`Expected 'radians' to be a valid number, but got: ${n}`:`Conversion to degrees will result in NaN for radians: ${n}`);const{PI:o}=Math;return R(180*n/o,3)}(Math.atan2(n,e));t=R(t,0);return t<0&&(t+=360),t}!function(){const n=C(".menu__orientation"),e=C(".menu__angle-picker--rotator"),t=C(".menu__orientation-output");n.addEventListener("mousemove",(n=>{const r=C(".menu__angle-picker--center-dot").getBoundingClientRect(),o=q(n.x-r.x,r.y-n.y);_("--_rotation",`${o}deg`,e),t.textContent=`${o}°`}))}();E("menu__add-color-button").addEventListener("click",(function(){const n=E("menu__table-body"),e=function(n,e){if(!e)return document.getElementById(n);const t=e?.tagName?.includes("-");return t?e.shadowRoot.getElementById(n):e.getElementById(n)}("template__linear-gradient");var r;const o=C("tr",(r=e,document.importNode(r.content,!0))),a=C("input[type='color']",o),i=A("input[type='number']",o);a.addEventListener("input",(n=>{const e=n.currentTarget,t=$(e,"td"),r=e.value,o=C("label",t),a=function(n,e=document.body){return getComputedStyle(e).getPropertyValue(n)}("--_label-color",o),{contrastRatio:i,respectsW3CGuidelines:c}=function(n,e){const t=[z(n.slice(1,3)),z(n.slice(3,5)),z(n.slice(5,7))],r=[z(e.slice(1,3)),z(e.slice(3,5)),z(e.slice(5,7))],o=T(t),a=T(r);let i=o>a?(o+.05)/(a+.05):(a+.05)/(o+.05);return i=R(i,2),{contrastRatio:i,respectsW3CGuidelines:i>=4.5}}(r,a);!c&&_("--_label-color","#ffffff"===a?"#000000":"#ffffff",o),o.textContent=B(r,"UPPERCASE"),_("--_cell-bg-color",r,t)}));for(const n of i)n.addEventListener("input",(n=>{const e=n.currentTarget;t(e.valueAsNumber);if(e.id.includes("opacity")){P(e,Number(L("min",e)),Number(L("max",e)))}}));n.appendChild(o),I(n)}));E("menu__table-body").addEventListener("click",(function(n){const e=n.target,r=(o=e,Array.from(o.classList));var o;const a=r[0].includes("top"),i=r[0].includes("bottom"),c=r[0].includes("delete");if(t(e),t(r),B(e.tagName,"lowercase").includes("tbody"))return;const s=$(e,"tr"),l=$(s,"tbody");var u,p,b;a&&function(n,e){const t=A("tr",e),r=t.indexOf(n);if(-1===r)return void console.error("Row not found in the table body.");if(r>0){const o=t[r-1];e.insertBefore(n,o),I(e)}}(s,l),i&&function(n,e){const t=A("tr",e),r=t.indexOf(n);if(-1===r)return void console.error("Row not found in the table body.");if(r<t.length-1){const o=t[r+1];e.insertBefore(o,n),I(e)}}(s,l),c&&(t("deleteRow",u=s,"tbody",p=l),b=u,p.removeChild(b),I(p))}))})();