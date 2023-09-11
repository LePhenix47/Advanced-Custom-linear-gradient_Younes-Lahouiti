import CSSGradient from "../index-css.class";
import { percentageToHex } from "@utils/helpers/number.helpers";

type ConicGradientPosition = {
  start: string;
  end: string | null;
};

type ConicGradientColorStop = {
  id: number;
  color: string;
  startAngle: number | null; // % or px
  endAngle: number | null; // % or px
  transitionAngle: number | null; // % or px
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
 * Class for CSS Conic Gradient
 * @extends CSSGradient
 */
class CSSConicGradient extends CSSGradient {
  orientation: number;
  position: ConicGradientPosition;
  isRepeating: boolean;
  stopColors: ConicGradientColorStop[];

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
   * @param {ConicGradientColorStop} stopColor - The stop color to normalize.
   *
   * @returns {void}
   *
   * @private
   */
  private normalizeStopColorValues(stopColor: ConicGradientColorStop): void {
    const {
      color: hexColor,
      opacity,
      startAngle,
      endAngle,
      transitionAngle,
    } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;

    this.isTransitionAngleValid(startAngle, endAngle, transitionAngle);
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
    startAngle: number,
    endAngle: number,
    transitionAngle: number
  ): boolean {
    const hasNoTransitionAngle: boolean = transitionAngle === null;
    if (hasNoTransitionAngle) {
      return true;
    }

    const { isNaN } = Number;
    const inputtedArguments: number[] = [startAngle, endAngle, transitionAngle];

    for (const arg of inputtedArguments) {
      const hasInvalidType: boolean = typeof arg !== "number";
      const hasNaNValue: boolean = isNaN(arg);

      const argumentIsInvalid: boolean = hasInvalidType || hasNaNValue;
      if (argumentIsInvalid) {
        const errorMessage: string = hasInvalidType
          ? `Invalid argument type, must be a number, got: ${arg} of type ${typeof arg}`
          : `Invalid number value, received NaN, got: ${arg} of type ${typeof arg}`;

        throw new TypeError(errorMessage);
      }
    }

    const isWithinRange: boolean =
      transitionAngle >= startAngle && transitionAngle <= endAngle;

    return isWithinRange;
  }

  /**
   * Sorts the stop colors array by their `id` property in ascending order.
   *
   * @private
   */
  private sortStopColorsArrayById(): void {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }
  /**
   * Set whether the conic gradient should repeat.
   * @param {boolean} repeatValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setRepeating(repeatValue: boolean): void {
    this.isRepeating = repeatValue;
  }

  /**
   * Set the orientation angle for the conic gradient.
   * @param {number} orientation - The orientation angle in degrees.
   */
  setOrientation(orientation: number) {
    this.orientation = orientation;
  }

  setPositionCoordinates(coordinates: ConicGradientPosition) {
    const { start: coordsStart, end: coordsEnd } = coordinates;

    this.position.start = coordsStart;

    const hasNoEndAngle: boolean = !coordsEnd;
    if (hasNoEndAngle) {
      this.position.end = "50%";
    } else {
      this.position.end = coordsEnd;
    }
  }

  addStopColor(stopColor: ConicGradientColorStop): void {
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
    this.isTransitionAngleValid(startAngle, endAngle, transitionAngle);

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

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
      const stopColor: ConicGradientColorStop = this.stopColors[i];
      const { color, startAngle, endAngle, transitionAngle } = stopColor;

      const isLastIndex: boolean = i === this.stopColors.length - 1;
      const commaSeparator: string = isLastIndex ? "" : ", ";

      const formattedStartAngle: string = !startAngle ? "" : `${startAngle}deg`;
      const formattedEndAngle: string = !endAngle ? "" : `, ${endAngle}deg`;

      const formattedTransitionAngle = !transitionAngle
        ? ""
        : `${transitionAngle}deg`;

      const formattedAngles = `${formattedStartAngle} ${formattedEndAngle} ${formattedTransitionAngle}`;

      conicGradientString += `${color} ${formattedAngles}${commaSeparator}`;
    }
    conicGradientString += ")";
    return conicGradientString;
  }
}
export default CSSConicGradient;

// Example usage:
const conicGradient = CSSGradient.create("conic") as CSSConicGradient;

// Set the orientation angle
conicGradient.setOrientation(0);

// Set the position coordinates
conicGradient.setPositionCoordinates({
  start: "50%",
  end: "50%",
});

// Add stop colors
conicGradient.addStopColor({
  id: 1,
  color: "#000000",
  startAngle: 180,
  endAngle: null,
  transitionAngle: null,
  opacity: "0%",
});

conicGradient.addStopColor({
  id: 2,
  color: "#40e0d0",
  startAngle: 180,
  endAngle: 260,
  transitionAngle: null,
  opacity: "100%",
});

conicGradient.addStopColor({
  id: 3,
  color: "#ffffff",
  startAngle: 360,
  endAngle: null,
  transitionAngle: null,
  opacity: "100%",
});

// Generate the CSS gradient string
const cssGradientString = conicGradient.generateCssGradient();

// You can use cssGradientString as your background-image property
console.log(cssGradientString);

const div = document.querySelector("div");

// div.style.setProperty("--_bg-img", generatedGradient);
