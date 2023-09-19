import {
  calculateCoordsFromRadian,
  degreesToRadians,
} from "@utils/helpers/math.helpers";
import CanvasGradientBase, {
  CanvasGradientColorStop,
  CanvasLinearGradientColorStop,
} from "../class-base/canvas-gradient-base.class";
import JSCanvasGradient from "../index-canvas.class";

type CanvasGradientInitialCoords = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

class CanvasLinearGradient extends CanvasGradientBase {
  initialCoords: CanvasGradientInitialCoords;

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;

    const { width, height } = this.context.canvas;

    this.initialCoords = {
      x0: 0,
      x1: width,
      y0: 0,
      y1: height,
    };
  }

  /*
  Ex of how to create a linear gradient using JS canvas rendering methods

  const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Create a linear gradient
// The start gradient point is at x=20, y=0
// The end gradient point is at x=220, y=0
const gradient = ctx.createLinearGradient(20, 0, 220, 0);

// x0, x1, y0 and y1 → Create a method to add the initial coords

// Add three color stops
gradient.addColorStop(0, "green");
gradient.addColorStop(0.5, "cyan");
gradient.addColorStop(1, "green");

// Set the fill style and draw a rectangle
ctx.fillStyle = gradient;
ctx.fillRect(20, 20, 200, 100);
  */
  /**
   * Add a stop color to the linear gradient.
   * @param {CSSLinearGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: CanvasGradientColorStop): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = ["id", "color", "offset", "opacity"];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the linear gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.normalizeStopColorValues(stopColor);

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  setInitialCoords(x0: number, x1: number, y0: number, y1: number) {
    this.initialCoords = {
      x0,
      x1,
      y0,
      y1,
    };
  }

  private normalizeStopColorValues(stopColor: CanvasGradientColorStop) {
    this.normalizeOpacity(stopColor);

    this.normalizeOffset(stopColor);
  }

  generateCanvasGradient(): { gradient: CanvasGradient; code: string | null } {
    const { x0, y0, x1, y1 } = this.initialCoords;

    const gradient: CanvasGradient = this.context.createLinearGradient(
      x0,
      y0,
      x1,
      y1
    );

    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return { gradient, code: null };
    }
    const { canvas } = this.context;

    const normalizedX0: string = x0 === canvas.width ? "canvas.width" : `${x0}`;
    const normalizedX1: string = x1 === canvas.width ? "canvas.width" : `${x1}`;

    const normalizedY0: string =
      y0 === canvas.height ? "canvas.height" : `${y0}`;
    const normalizedY1: string =
      y1 === canvas.height ? "canvas.height" : `${y1}`;

    let codeString: string = `
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gradient = ctx.createLinearGradient(${normalizedX0}, ${normalizedY0}, ${normalizedX1}, ${normalizedY1});\n`;

    for (let i = 0; i < this.stopColors.length; i++) {
      const stopColor: CanvasLinearGradientColorStop = this.stopColors[i];

      console.log(stopColor);
      const { color, offset } = stopColor;

      const numberOffset = offset as number;

      const { isNaN } = Number;
      const defaultIndexOffset: number = isNaN(numberOffset)
        ? this.getOffsetByIndex(i, this.stopColors.length)
        : numberOffset;

      console.log({ defaultIndexOffset });

      gradient.addColorStop(defaultIndexOffset, color);

      codeString += `gradient.addColorStop(${defaultIndexOffset}, ${color});\n`;
    }

    codeString += `
ctx.fillStyle = gradient;\n
ctx.fillRect(0, 0, canvas.width, canvas.height);\n`;

    return { gradient, code: codeString };
  }
}

export default CanvasLinearGradient;

// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Create an instance of CanvasLinearGradient
// const linearGradient = new JSCanvasGradient().create(
//   "linear",
//   ctx
// ) as CanvasLinearGradient;

// // Add color stops to the gradient
// linearGradient.addStopColor({
//   id: 1,
//   color: "#00ff00",
//   offset: null,
//   opacity: "100%",
// });

// linearGradient.addStopColor({
//   id: 2,
//   color: "#ff00ff",
//   offset: null,
//   opacity: "100%",
// });

// linearGradient.addStopColor({
//   id: 3,
//   color: "#00ff00",
//   offset: null,
//   opacity: "100%",
// });

// // Generate the canvas gradient and code
// const { gradient, code } = linearGradient.generateCanvasGradient();

// console.log(code);

// // Set the fill style to the gradient
// ctx.fillStyle = gradient;

// // Draw a rectangle filled with the linear gradient
// ctx.fillRect(0, 0, canvas.width, canvas.height);
