import { percentageToHex } from "@utils/helpers/number.helpers";
import CSSGradient from "../index-css.class";

type RadialGradientPosition = {
  start: string;
  end: string | null;
};

type RadialGradientColorStop = {
  id: number;
  color: string;
  offset: string | null;
  opacity: string;
};
/**
 * Class for CSS Radial Gradient
 * @extends CSSGradient
 */
class CSSRadialGradient extends CSSGradient {
  shape: "circle" | "ellipse";
  position: RadialGradientPosition;
  isRepeating: boolean;
  stopColors: RadialGradientColorStop[];

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

  // Add methods specific to radial gradients here
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
   * Set whether the radial gradient should repeat.
   * @param {boolean} repeatValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setRepeating(repeatValue: boolean): void {
    this.isRepeating = repeatValue;
  }
  /**
   * Add a stop color to the radial gradient.
   * @param {LinearGradientColorStop} stopColor - The stop color to add.
   *
   * @throws {TypeError} If the stopColor object is missing required properties.
   *
   * @returns {void}
   *
   */
  addStopColor(stopColor: RadialGradientColorStop): void {
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
  private normalizeStopColorValues(stopColor: RadialGradientColorStop): void {
    const { color: hexColor, offset, opacity } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;

    const normalizedOffset: string = !offset ? "" : offset;
    stopColor.offset = normalizedOffset;
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
      const stopColor: RadialGradientColorStop = this.stopColors[i];
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
// Example usage:
const radialGradient = CSSGradient.create("radial") as CSSRadialGradient;
// background: repeating-radial-gradient(circle at 50% 50%, #333333FF , #333333FF 10px, #eeeeee1A 10px, #eeeeee1A 20px)
radialGradient.setRepeating(true);
radialGradient.setShape("circle");
radialGradient.setPositionCoordinates({ start: "50%", end: null });
radialGradient.addStopColor({
  id: 0,
  color: "#333333",
  offset: null,
  opacity: "100%",
});
radialGradient.addStopColor({
  id: 1,
  color: "#333333",
  offset: "10px",
  opacity: "100%",
});
radialGradient.addStopColor({
  id: 2,
  color: "#eeeeee",
  offset: "10px",
  opacity: "10%",
});
radialGradient.addStopColor({
  id: 3,
  color: "#eeeeee",
  offset: "20px",
  opacity: "10%",
});

const generatedGradient = radialGradient.generateCssGradient();
