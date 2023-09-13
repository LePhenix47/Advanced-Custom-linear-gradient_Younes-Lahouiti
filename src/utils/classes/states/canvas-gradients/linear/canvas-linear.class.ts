import {
  calculateCoordsFromRadian,
  degreesToRadians,
} from "@utils/helpers/math.helpers";
import CanvasGradientBase, {
  CanvasGradientColorStop,
  CanvasLinearGradientColorStop,
} from "../class-base/canvas-gradient-base.class";

type CanvasLinearGradientOrientation = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};
class CanvasLinearGradient extends CanvasGradientBase {
  orientationCoords: CanvasLinearGradientOrientation;

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.context = context;

    this.orientationCoords = {
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
    };
  }

  setOrientation(orientation: number) {
    const angleInRadians: number = degreesToRadians(orientation);

    const { x1, x2, y1, y2 } = calculateCoordsFromRadian(angleInRadians);

    this.orientationCoords = {
      x0: x1,
      y0: y1,
      x1: x2,
      y1: y2,
    };
  }

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

  private normalizeStopColorValues(stopColor: CanvasGradientColorStop) {
    this.normalizeOpacity(stopColor);

    this.normalizeOffset(stopColor);
  }

  generateCanvasGradient(): CanvasGradient {
    const { x0, y0, x1, y1 } = this.orientationCoords;

    const canvas: HTMLCanvasElement = this.context.canvas;

    const { width, height } = canvas;

    const gradient: CanvasGradient = this.context.createLinearGradient(
      x0 * width,
      y0 * height,
      x1 * width,
      y1 * height
    );

    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return gradient;
    }

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
    }

    return gradient;
  }
}

export default CanvasLinearGradient;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
/*

// Instantiate the CanvasLinearGradient object
const linearGradient = new CanvasLinearGradient(context);

// Set the orientation of the linear gradient (optional)
linearGradient.setOrientation(45); // 45-degree angle

// Add stop colors
linearGradient.addStopColor({
  id: 0,
  color: "#00ff00",
  offset: null,
  opacity: "50%"
});

linearGradient.addStopColor({
  id: 1,
  color: "#001f1f",
  offset: null,
  opacity: "100%"
});

linearGradient.addStopColor({
  id: 2,
  color: "#ff00ff",
  offset: null,
  opacity: "20%"
});

// Generate the canvas gradient
const canvasGradient = linearGradient.generateCanvasGradient();
console.log(linearGradient);
// Use the canvas gradient to fill a rectangle
// context.fillStyle = canvasGradient;
// context.fillRect(0, 0, canvas.width, canvas.height);

// window.addEventListener("resize", handleWindowResize);

function handleWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.outerHeight / 3;

  // Use the canvas gradient to fill a rectangle
  context.fillStyle = canvasGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}
handleWindowResize();
*/
