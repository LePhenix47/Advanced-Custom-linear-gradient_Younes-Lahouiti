import { getObjectEntries } from "@utils/helpers/object.helpers";
import SVGGradient, {
  SVGCoordsFromRadian,
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGLinearGradientColorStop,
  SVGSpreadMethods,
} from "../index-svg.class";
import {
  calculateCoordsFromRadian,
  degreesToRadians,
} from "@utils/helpers/math.helpers";

type SVGRadialGradientAttributes = {
  centerX: string;
  centerY: string;
  radius: string;
  focalRadius: string;
  focalX: string;
  focalY: string;
};
class SVGRadialGradient extends SVGGradient {
  /*
SVG Radial gradient formal syntax:

[ORIENTATION IN RADIANS] = [ORIENTATION IN DEGREES] × π ÷ 180

    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100dvh">
      <defs>
        <radialGradient id="svg-radial-gradient" cx=[CENTER X] cy=[CENTER X] r=[CIRCLE RADIUS] fx=[FOCAL POINT X] fy=[FOCAL POINT Y]>
          <stop offset=[OFFSET1]% style="stop-color: #[COLOR1]; stop-opacity: [OPACITY1]%" />
          <stop offset=[OFFSET2]% style="stop-color: #[COLOR2]; stop-opacity: [OPACITY2]%" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#svg-radial-gradient)" />
    </svg>

  */
  // Properties specific to radial gradients with their default values as strings
  radialGradientAttributes: SVGRadialGradientAttributes = {
    centerX: "50%",
    centerY: "50%",
    radius: "50%",
    focalRadius: "0%",
    focalX: "50%",
    focalY: "50%",
  };

  spreadMethod: SVGSpreadMethods;
  stopColors: SVGLinearGradientColorStop[];
  gradientTransform: SVGGradientTransformString;
  gradientUnits: SVGGradientUnits;
  IDENTITY_TRANSFORM: SVGGradientTransformString;

  constructor() {
    super();

    this.spreadMethod = "pad";

    this.IDENTITY_TRANSFORM = "matrix(1 0 0 1 0 0)";

    this.gradientTransform = this.IDENTITY_TRANSFORM; // Need to add a method to set this value

    this.gradientUnits = "objectBoundingBox"; // Need to add a method to set this value too

    this.stopColors = [];
  }

  // Set the center point of the radial gradient
  setCenter(cx: string, cy: string): void {
    // Validate and set the center point
    this.radialGradientAttributes.centerX = cx;
    this.radialGradientAttributes.centerY = cy;
  }

  // Set the radius of the radial gradient
  setRadius(r: string): void {
    // Validate and set the radius
    this.radialGradientAttributes.radius = r;
  }

  // Set the fr property
  setFocalRadius(fr: string): void {
    // Validate and set the focal radius
    this.radialGradientAttributes.focalRadius = fr;
  }

  // Set the focal point of the radial gradient
  setFocalPoint(fx: string, fy: string): void {
    // Validate and set the focal point
    this.radialGradientAttributes.focalX = fx;
    this.radialGradientAttributes.focalY = fy;
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
   * Sets the spreading method for the SVG linear gradient
   * @param {SVGSpreadMethods} methodValue - Can be `"pad"`, `"reflect"` or `"repeat"`
   * @returns {void}
   */
  setSpreadMethod(methodValue: SVGSpreadMethods): void {
    this.spreadMethod = methodValue;
  }

  /**
   * Set the gradient transform using an object with transform functions.
   *
   * @param {SVGGradientTransformObject} transform - The object with gradient transform functions.
   *
   * @returns {void}
   */
  setGradientTransform(transform: SVGGradientTransformObject): void {
    const appliedTransforms: Set<string> = new Set();
    let transformString: SVGGradientTransformString = this.IDENTITY_TRANSFORM;

    // Iterate through the transform object and add unique transform functions
    for (const [key, value] of Object.entries(transform)) {
      const transformFunction = `${key}(${value})`;

      // Check if this transform has not been applied before
      if (!appliedTransforms.has(transformFunction)) {
        transformString += ` ${transformFunction} `;
        appliedTransforms.add(transformFunction);
      }
    }

    this.gradientTransform =
      transformString.trim() as SVGGradientTransformString; // Remove trailing space
  }

  /**
   * Generate the SVG linear gradient string based on the set parameters.
   * @returns {string} - The SVG linear gradient string.
   */
  generateSvgGradient(): string {}
}

export default SVGRadialGradient;
