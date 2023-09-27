import { percentageToHex } from "@utils/helpers/number.helpers";
import CSSGradient from "../index-css.class";
import CSSGradientBase from "../class-base/css-gradient-base.class";

type RadialGradientPosition = {
  start: string;
  end: string | null;
};

export type CSSRadialGradientColorStop = {
  id: number;
  color: string;
  offset: {
    value: number;
    unit: string;
  };
  opacity: string;
};

/**
 * Class for creating CSS radial gradients.
 * @extends CSSGradientBase
 */
class CSSRadialGradient extends CSSGradientBase {
  /**
   * The shape of the radial gradient (either "circle" or "ellipse").
   * @type {"circle" | "ellipse"}
   */
  shape: "circle" | "ellipse";

  /**
   * The position of the radial gradient.
   * @type {RadialGradientPosition}
   */
  position: RadialGradientPosition;

  /**
   * An array of color stops for the radial gradient.
   * @type {CSSRadialGradientColorStop[]}
   */

  /*
  CSS Radial gradient formal syntax:
radial-gradient([shape] [position], #[color1] [offset]%, #[color2] [offset]%, ...)

For the stop colors, we can set the opacity by changing the HEX into an RGBA value

  */

  constructor() {
    super();

    this.isRepeating = false;
    this.shape = "circle";
    this.position = {
      start: "50%",
      end: "50%",
    };
    this.stopColors = [];
  }

  /**
   * Set the shape of the radial gradient (either "circle" or "ellipse").
   * @param {"ellipse" | "circle"} shape - The shape of the radial gradient.
   * @returns {void}
   */
  setShape(shape: "ellipse" | "circle") {
    const hasInvalidArgument: boolean =
      shape !== "ellipse" && shape !== "circle";
    if (hasInvalidArgument) {
      throw new TypeError(
        `Invalid shape for radial gradient, expected either an ellipse or a circle but instead got ${shape}`
      );
    }

    this.shape = shape;
  }

  /**
   * Set the position coordinates of the radial gradient.
   * @param {RadialGradientPosition} coordinates - The position coordinates.
   * @returns {void}
   */
  setPositionCoordinates(coordinates: RadialGradientPosition) {
    const { start: coordsStart, end: coordsEnd } = coordinates;

    this.position.start = coordsStart;

    const hasNoEndAngle: boolean = !coordsEnd;
    if (hasNoEndAngle) {
      this.position.end = "50%";
    } else {
      this.position.end = coordsEnd;
    }
  }

  /**
   * Add a stop color to the radial gradient.
   * @param {CSSRadialGradientColorStop} stopColor - The stop color to add.
   * @throws {TypeError} If the stopColor object is missing required properties.
   * @returns {void}
   */
  addStopColor(stopColor: CSSRadialGradientColorStop): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = ["id", "color", "offset", "opacity"];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the radial gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.normalizeStopColorValues(stopColor);

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  /**
   * Normalizes the values of a stop color by converting opacity to a hexadecimal alpha value
   * and changing the offset value from `null` to an empty string
   *
   * @param {LinearGradientColorStop} stopColor - The stop color to normalize.
   *
   * @returns {void}
   *
   * @private
   */
  private normalizeStopColorValues(
    stopColor: CSSRadialGradientColorStop
  ): void {
    this.normalizeOpacity(stopColor);

    this.normalizeOffset(stopColor);
  }

  /**
   * Generate the CSS radial gradient string based on the set parameters.
   * @returns {string} - The CSS radial gradient string.
   */
  generateCssGradient(): string {
    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return "none";
    }

    let radialGradientString: string = this.isRepeating
      ? "repeating-radial-gradient("
      : "radial-gradient(";

    radialGradientString += `${this.shape} at ${this.position.start} ${this.position.end}, `;

    for (let i = 0; i < this.stopColors.length; i++) {
      //
      const stopColor = this.stopColors[i] as CSSRadialGradientColorStop;
      const { color, offset } = stopColor;

      const isLastIndex: boolean = i === this.stopColors.length - 1;
      const commaSeparator: string = isLastIndex ? "" : ", ";

      radialGradientString += `${color} ${offset}${commaSeparator}`;
    }
    radialGradientString += ")";
    return radialGradientString;
  }
}

export default CSSRadialGradient;

// Example usage:
// const cssRadialGradient = CSSGradient.create("radial") as CSSRadialGradient;

/*
background-image: conic-gradient(
   transparent 180deg,
   turquoise 180deg 260deg,
   white 360deg
 );
*/
// cssRadialGradient.setRepeating(true);
// cssRadialGradient.setShape("circle");
// cssRadialGradient.setPositionCoordinates({ start: "50%", end: null });
// cssRadialGradient.addStopColor({
//   id: 0,
//   color: "#333333",
//   offset: null,
//   opacity: "100%",
// });
// cssRadialGradient.addStopColor({
//   id: 1,
//   color: "#333333",
//   offset: "10px",
//   opacity: "100%",
// });
// cssRadialGradient.addStopColor({
//   id: 2,
//   color: "#eeeeee",
//   offset: "10px",
//   opacity: "10%",
// });
// cssRadialGradient.addStopColor({
//   id: 3,
//   color: "#eeeeee",
//   offset: "20px",
//   opacity: "10%",
// });

// const generatedGradient = cssRadialGradient.generateCssGradient();
