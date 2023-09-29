import { formatStringSpacing } from "@utils/helpers/string.helpers";
import CSSGradientBase from "../class-base/css-gradient-base.class";

type ConicGradientPosition = {
  start: string;
  end: string | null;
};

export type CSSConicGradientColorStop = {
  id: number;
  color: string;
  startAngle: string | number | null; // % or px
  endAngle: string | number | null; // % or px
  transitionAngle: string | number | null; // % or px
  opacity: string;
};

/**
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */
/**
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */

/**
 * Class for creating CSS conic gradients.
 * @extends CSSGradientBase
 */
class CSSConicGradient extends CSSGradientBase {
  /**
   * The orientation angle of the conic gradient in degrees.
   * @type {number}
   */
  orientation: number;

  /**
   * The position coordinates of the conic gradient.
   * @type {ConicGradientPosition}
   */
  position: ConicGradientPosition;

  constructor() {
    super();

    this.isRepeating = false;
    this.orientation = 0;
    this.position = {
      start: "50%",
      end: "50%",
    };
    this.stopColors = [];
  }

  /*
  CSS Conic gradient formal syntax:

  conic-gradient(
  from [orientation]deg at [position-x]%/px [position-y]%/px,

  #[Color1] [start angle]deg [end angle (optional)]deg, [transition angle (optional)]deg,

  #[Color2] [Color1's end angle]deg [Color2 end angle (optional)]deg, [transition angle (optional if Color1 doesn't have a transition angle)]deg,

  #[Color3] ...
);

  */

  /**
   * Normalizes the values of a stop color by converting opacity to a hexadecimal alpha value
   * and checking if the transition angle is within the range of the color's start & end angle
   *
   * @param {CSSConicGradientColorStop} stopColor - The stop color to normalize.
   *
   * @returns {void}
   *
   * @private
   */
  private normalizeStopColorValues(stopColor: CSSConicGradientColorStop): void {
    this.normalizeOpacity(stopColor);

    this.normalizeAngles(stopColor);
  }

  /**
   * Checks if a transition angle is within the specified range (inclusive).
   *
   * @param {number} startAngle - The start angle in degrees.
   * @param {number} endAngle - The end angle in degrees.
   * @param {number|null} transitionAngle - The transition angle in degrees to check, or null if no transition angle is provided.
   *
   * @returns {boolean} - True if the transition angle is within the specified range, false otherwise.
   *
   * @throws {TypeError} - Throws a TypeError if any of the input arguments have invalid types or are NaN.
   *
   * @private
   */
  private isTransitionAngleValid(
    startAngle: string,
    endAngle: string,
    transitionAngle: string
  ): boolean {
    const hasNoTransitionAngle: boolean = transitionAngle === null;
    if (hasNoTransitionAngle) {
      return true;
    }

    const { isNaN } = Number;
    const inputtedArguments: string[] = [startAngle, endAngle, transitionAngle];

    for (let arg of inputtedArguments) {
      const hasInvalidType: boolean = typeof arg !== "string";
      const hasNaNValue: boolean = isNaN(arg);

      const argumentIsInvalid: boolean = hasInvalidType || hasNaNValue;
      if (argumentIsInvalid) {
        const errorMessage: string = hasInvalidType
          ? `Invalid argument type, must be a number, got: ${arg} of type ${typeof arg}`
          : `Invalid number value, received NaN, got: ${arg} of type ${typeof arg}`;

        throw new TypeError(errorMessage);
      }
    }

    const formattedStartAngle: number = Number(
      startAngle.replaceAll("deg", "")
    );
    const formattedEndAngle: number = Number(endAngle.replaceAll("deg", ""));
    const formattedTransitionAngle: number = Number(
      transitionAngle.replaceAll("deg", "")
    );

    const isWithinRange: boolean =
      formattedTransitionAngle >= formattedStartAngle &&
      formattedTransitionAngle <= formattedEndAngle;

    return isWithinRange;
  }

  /**
   * Set the orientation angle for the conic gradient.
   * @param {number} orientation - The orientation angle in degrees.
   */
  setOrientation(orientation: number) {
    this.orientation = orientation;
  }

  /**
   * Set the position coordinates of the conic gradient.
   * @param {ConicGradientPosition} coordinates - The position coordinates.
   * @returns {void}
   */
  setPositionCoordinates(coordinates: ConicGradientPosition): void {
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
   * Add a stop color to the conic gradient.
   * @param {CSSConicGradientColorStop} stopColor - The stop color to add.
   * @throws {TypeError} If the stopColor object is missing required properties.
   * @returns {void}
   */
  addStopColor(stopColor: CSSConicGradientColorStop): void {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = [
      "id",
      "color",
      "startAngle",
      "endAngle",
      "transitionAngle",
      "opacity",
    ];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the conic gradient, ${property} does not exist on the passed object`
        );
      }
    }

    this.normalizeStopColorValues(stopColor);

    const { startAngle, endAngle, transitionAngle } = stopColor;
    this.isTransitionAngleValid(
      startAngle as string,
      endAngle as string,
      transitionAngle as string
    );

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  /**
   * Generate the CSS conic gradient string based on the set parameters.
   * @returns {string} - The CSS conic gradient string.
   */
  /*

  generateCssGradient(): string {
    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return "none";
    }

    let conicGradientString: string = this.isRepeating
      ? "repeating-conic-gradient("
      : "conic-gradient(";

    conicGradientString += `from ${this.orientation}deg at ${this.position.start} ${this.position.end}, `;

    for (let i = 0; i < this.stopColors.length; i++) {
      //
      const stopColor = this.stopColors[i] as CSSConicGradientColorStop;
      const { color, startAngle, endAngle, transitionAngle } = stopColor;

      const isLastIndex: boolean = i === this.stopColors.length - 1;
      const commaSeparator: string = isLastIndex ? "" : ", ";
    
  [start angle]deg [end angle (optional)]deg, [transition angle (optional)]deg,

  Doesn't properly work when the stop color does not have a start, end or transition angle

  ex of a broken output: conic-gradient(from 90deg at 83% 10%, #ffffffFF  , , #000000FF 45deg 87deg, 180deg)

      const formattedAngles: string = `${startAngle} ${endAngle}, ${transitionAngle}`;

      conicGradientString += `${color} ${formattedAngles}${commaSeparator}`;
    }
    conicGradientString += ")";
    return conicGradientString;
  }
   */

  /**
   * Generate the CSS conic gradient string based on the set parameters.
   * @returns {string} - The CSS conic gradient string.
   */
  generateCssGradient(): string {
    const cannotCreateGradient: boolean = this.stopColors.length < 2;
    if (cannotCreateGradient) {
      return "none";
    }

    let conicGradientString: string = this.isRepeating
      ? "repeating-conic-gradient("
      : "conic-gradient(";

    conicGradientString += `from ${this.orientation}deg at ${this.position.start} ${this.position.end}, `;

    for (let i = 0; i < this.stopColors.length; i++) {
      const stopColor = this.stopColors[i] as CSSConicGradientColorStop;
      const { color, startAngle, endAngle, transitionAngle } = stopColor;

      const formattedAngles: string = `${startAngle}${
        endAngle ? ` ${endAngle}` : ""
      }${transitionAngle ? ` ${transitionAngle}` : ""}`;

      conicGradientString += `${color} ${formattedAngles}`;

      const isNotLastStopColorHint: boolean = i !== this.stopColors.length - 1;
      if (isNotLastStopColorHint) {
        conicGradientString += ", ";
      }
    }

    conicGradientString = conicGradientString.trim() + ")";
    return formatStringSpacing(conicGradientString);
  }
}
export default CSSConicGradient;

// // Example usage:
// const cssConicGradient = CSSGradient.create("conic") as CSSConicGradient;

// // Set the orientation angle
// cssConicGradient.setOrientation(0);

// // Set the position coordinates
// cssConicGradient.setPositionCoordinates({
//   start: "50%",
//   end: "50%",
// });

// // Add stop colors
// cssConicGradient.addStopColor({
//   id: 1,
//   color: "#000000",
//   startAngle: 180,
//   endAngle: null,
//   transitionAngle: null,
//   opacity: "0%",
// });

// cssConicGradient.addStopColor({
//   id: 2,
//   color: "#40e0d0",
//   startAngle: 180,
//   endAngle: 260,
//   transitionAngle: null,
//   opacity: "100%",
// });

// cssConicGradient.addStopColor({
//   id: 3,
//   color: "#ffffff",
//   startAngle: 360,
//   endAngle: null,
//   transitionAngle: null,
//   opacity: "100%",
// });

// // Generate the CSS gradient string
// const cssGradientString = cssConicGradient.generateCssGradient();

// // You can use cssGradientString as your background-image property
// console.log(cssGradientString);

// const div = document.querySelector("div");

// div.style.setProperty("--_bg-img", generatedGradient);
