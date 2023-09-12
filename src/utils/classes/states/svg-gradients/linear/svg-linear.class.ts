import { getObjectEntries } from "@utils/helpers/object.helpers";
import SVGGradient, {
  SVGCoordsFromRadian,
  SVGGradientTransformObject,
  SVGGradientTransformString,
  SVGGradientUnits,
  SVGGradientColorStop,
  SVGSpreadMethods,
} from "../index-svg.class";
import {
  calculateCoordsFromRadian,
  degreesToRadians,
} from "@utils/helpers/math.helpers";
import SVGGradientBase from "../class-base/svg-gradient-base.class";

class SVGLinearGradient extends SVGGradientBase {
  /*
SVG Linear gradient formal syntax:

[ORIENTATION IN RADIANS] = [ORIENTATION IN DEGREES] × π ÷ 180

      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 100 100" width="100%" height="100dvh">
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

  orientationCoords: SVGCoordsFromRadian;
  constructor() {
    super();

    this.orientationCoords = {
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
    };
  }

  /**
   * Set the orientation angle for the linear gradient.
   * @param {number} orientation - The orientation angle in degrees.
   *
   * @returns {void}
   */
  setOrientation(orientation: number): void {
    const radAngle = degreesToRadians(orientation);

    this.orientationCoords = calculateCoordsFromRadian(radAngle);
  }

  /**
   * Add a stop color to the linear gradient.
   * @param {SVGGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: SVGGradientColorStop): void {
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
   * Sets the spreading method for the SVG linear gradient
   * @param {SVGSpreadMethods} methodValue - Can be `"pad"`, `"reflect"` or `"repeat"`
   * @returns {void}
   */
  // setSpreadMethod(methodValue: SVGSpreadMethods): void {
  //   this.spreadMethod = methodValue;
  // }

  /**
   * Set the gradient transform using an object with transform functions.
   *
   * @param {SVGGradientTransformObject} transform - The object with gradient transform functions.
   *
   * @returns {void}
   */
  // setGradientTransform(transform: SVGGradientTransformObject): void {
  //   const appliedTransforms: Set<string> = new Set(this.gradientTransform);

  //   let transformString: SVGGradientTransformString[] = [
  //     this.IDENTITY_TRANSFORM,
  //   ];
  //   // Iterate through the transform object and add unique transform functions
  //   for (const [key, value] of Object.entries(transform)) {
  //     const transformFunction =
  //       `${key}(${value})` as SVGGradientTransformString;

  //     // Check if this transform has not been applied before
  //     const hasNotAppliedTransform: boolean =
  //       !appliedTransforms.has(transformFunction);
  //     if (hasNotAppliedTransform) {
  //       transformString.push(transformFunction);
  //       appliedTransforms.add(transformFunction);
  //     }
  //   }

  //   this.gradientTransform = transformString.join(
  //     " "
  //   ) as SVGGradientTransformString; // Remove trailing space
  // }

  /**
   * Generate the SVG linear gradient string based on the set parameters.
   * @returns {string} - The SVG linear gradient string.
   */
  generateSvgGradient(): string {
    const amountOfStopColors: number = this.stopColors.length;

    const cannotCreateGradient: boolean = amountOfStopColors < 2;
    if (cannotCreateGradient) {
      return "none";
    }

    let colorStops: string = "";

    for (let i = 0; i < amountOfStopColors; i++) {
      const stopColor: SVGGradientColorStop = this.stopColors[i];
      const { offset, color, opacity, id } = stopColor;

      let normalizedOffset: string = offset;
      const colorHasNoOffset: boolean = offset === null;
      if (colorHasNoOffset) {
        console.log(i / (amountOfStopColors - 1));
        normalizedOffset = `${(i / (amountOfStopColors - 1)) * 100}%`;
      }
      /*
      There's a problem, given the fact that the user can choose
      not to add an offset, I need to give a proper default value for it

      Imagine we had 2 colors stop and neither had an offset

      Then the 1st one should have a default offset of 0% and the second of 100%
      */
      colorStops += /* html */ `
      <stop offset="${normalizedOffset}" style="stop-color: ${color}; stop-opacity: ${opacity}" data-stop-id=${id} />
      `;
    }

    const { x1, x2, y1, y2 } = this.orientationCoords;
    const linearGradient: string = /* html */ `
<linearGradient 
  id="svg-linear-gradient" 

  x1="${x1}" 
  y1="${y1}"
  x2="${x2}"
  y2="${y2}"

  spreadMethod="${this.spreadMethod}"

  gradientTransform="${this.gradientTransform}"
  gradientUnits="${this.gradientUnits}"
  >
  ${colorStops}
</linearGradient>
`;

    const svg: string = /* html */ `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
  <defs>
    ${linearGradient}
  </defs>
  <rect width="100%" height="100%" fill="url(#svg-linear-gradient)" />
</svg>
`;

    return svg;
  }
}

export default SVGLinearGradient;

// Create an instance of SVGLinearGradient
const linearGradient = SVGGradient.create("linear") as SVGLinearGradient;

// Set the orientation to 45 degrees
linearGradient.setOrientation(135);

// Add the start and end stop colors
linearGradient.addStopColor({
  id: 0,
  color: "#ff6600",
  offset: null, // You can set the offset to null for the start color
  opacity: "100%",
});

linearGradient.addStopColor({
  id: 1,
  color: "#3399ff",
  offset: null, // Set the offset to 100% for the end color
  opacity: "100%",
});

linearGradient.setGradientTransform({
  skewX: 25,
});

// Generate the SVG linear gradient string
const svgGradientString = linearGradient.generateSvgGradient();

const div = document.querySelector("div");
div.innerHTML = svgGradientString;
