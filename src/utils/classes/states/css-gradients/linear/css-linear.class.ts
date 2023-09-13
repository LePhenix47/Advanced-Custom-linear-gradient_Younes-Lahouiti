import { percentageToHex } from "@utils/helpers/number.helpers";
import CSSGradient from "../index-css.class";
import CSSGradientBase from "../class-base/css-gradient-base.class";

/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
export type CSSLinearGradientColorStop = {
  id: number;
  color: string;
  offset: string | null;
  opacity: string;
};
class CSSLinearGradient extends CSSGradientBase {
  /*
  CSS Linear gradient formal syntax:
linear-gradient([orientation]deg,#[stop-color1] [offset]%,#[stop-color2] [offset]%...)

For the stop colors, we can set the opacity by changing the HEX into an RGBA value

  */

  isRepeating: boolean;
  orientation: number;
  stopColors: CSSLinearGradientColorStop[];

  constructor() {
    super();

    this.isRepeating = false;

    this.orientation = 0;

    this.stopColors = [];
  }

  /**
   * Set the orientation angle for the linear gradient.
   * @param {number} orientation - The orientation angle in degrees.
   */
  setOrientation(orientation: number) {
    this.orientation = orientation;
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
  addStopColor(stopColor: CSSLinearGradientColorStop): void {
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

  /**
   * Normalizes the values of a stop color by converting opacity to a hexadecimal alpha value
   * and changing the offset value from `null` to an empty string
   *
   * @param {CSSLinearGradientColorStop} stopColor - The stop color to normalize.
   *
   * @returns {void}
   *
   * @private
   */
  private normalizeStopColorValues(
    stopColor: CSSLinearGradientColorStop
  ): void {
    this.normalizeOpacity(stopColor);

    this.normalizeOffset(stopColor);
  }

  /**
   * Generate the CSS linear gradient string based on the set parameters.
   * @returns {string} - The CSS linear gradient string.
   */
  generateCssGradient(): string {
    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return "none";
    }

    let linearGradientString: string = this.isRepeating
      ? "repeating-linear-gradient("
      : "linear-gradient(";

    linearGradientString += `${this.orientation}deg, `;

    for (let i = 0; i < this.stopColors.length; i++) {
      //
      const stopColor: CSSLinearGradientColorStop = this.stopColors[i];
      const { color, offset } = stopColor;

      const isLastIndex: boolean = i === this.stopColors.length - 1;
      const commaSeparator: string = isLastIndex ? "" : ", ";

      linearGradientString += `${color} ${offset}${commaSeparator}`;
    }
    linearGradientString += ")";
    return linearGradientString;
  }
}

export default CSSLinearGradient;

// // Example usage:
// const cssLinearGradient = CSSGradient.create("linear") as CSSLinearGradient;
// cssLinearGradient.setRepeating(false);
// cssLinearGradient.setOrientation(135);
// cssLinearGradient.addStopColor({
//   id: 0,
//   color: "#ff0000",
//   offset: null,
//   opacity: "100%",
// });
// cssLinearGradient.addStopColor({
//   id: 1,
//   color: "#00ff00",
//   offset: null,
//   opacity: "10%",
// });
// cssLinearGradient.addStopColor({
//   id: 2,
//   color: "#0000ff",
//   offset: null,
//   opacity: "50%",
// });

// // cssLinearGradient.

// const generatedGradient = cssLinearGradient.generateCssGradient();
// console.log(generatedGradient);
