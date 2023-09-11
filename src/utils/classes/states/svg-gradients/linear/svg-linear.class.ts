import SVGGradient from "../index-svg.class";
import {
  calculateCoordsFromRadian,
  degreesToRadians,
} from "@utils/helpers/math.helpers";

type SVGSpreadMethods = "pad" | "reflect" | "repeat";

type SVGCoordsFromRadian = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
type SVGLinearGradientColorStop = {
  id: number;
  color: string;
  offset: string | null;
  opacity: string;
};
class SVGLinearGradient extends SVGGradient {
  /*
SVG Linear gradient formal syntax:

[ORIENTATION IN RADIANS] = [ORIENTATION IN DEGREES] × π ÷ 180

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" 
            x1=[(cos([ORIENTATION IN RADIANS]) + 1) / 2] 
            y1=[(sin([ORIENTATION IN RADIANS]) + 1) / 2]
            x2=[1 - x1]
            y2=[1 - y1]
           >
            <stop offset=[OFFSET1]% style="stop-color: #[COLOR1]; stop-opacity: [OPACITY1]%" />
            <stop offset=[OFFSET2]% style="stop-color: #[COLOR2]; stop-opacity: [OPACITY2]%" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>

      Notes:
      - From an orientation in degrees we can get 4 coordinates for the linear gradient SVG 
      - We MIGHT need to swap the y1 and y2 values since JS uses the SVG coords system, I haven't tested that yet
  */

  spreadMethod: SVGSpreadMethods;
  orientationCoords: SVGCoordsFromRadian;
  stopColors: SVGLinearGradientColorStop[];

  constructor() {
    super();

    this.spreadMethod = "pad";

    this.orientationCoords = {
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
    };

    this.stopColors = [];
  }

  /**
   * Set the orientation angle for the linear gradient.
   * @param {number} orientation - The orientation angle in degrees.
   */
  setOrientation(orientation: number) {
    const radAngle = degreesToRadians(orientation);

    this.orientationCoords = calculateCoordsFromRadian(radAngle);
  }

  /**
   * Add a stop color to the linear gradient.
   * @param {SVGLinearGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: SVGLinearGradientColorStop): void {
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

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  /**
   * Sorts the stop colors array by their `id` property in ascending order.
   *
   * @private
   */
  private sortStopColorsArrayById() {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

  /**
   * Set whether the linear gradient should repeat.
   * @param {SVGSpreadMethods} methodValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setSpreadMethod(methodValue: SVGSpreadMethods): void {
    this.spreadMethod = methodValue;
  }

  /**
   * Generate the CSS linear gradient string based on the set parameters.
   * @returns {string} - The CSS linear gradient string.
   */
  generateSvgGradient(): string {}
}

export default SVGLinearGradient;
