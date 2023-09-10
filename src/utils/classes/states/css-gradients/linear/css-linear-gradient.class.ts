import { percentageToHexAlpha } from "@utils/helpers/number.helpers";
import CSSGradient from "../index-css.class";

/**
 * Class for CSS Linear Gradient
 * @extends CSSGradient
 */
type LinearGradientColorStop = {
  id: number;
  color: string;
  offset: string | null;
  opacity: string;
};
class CSSLinearGradient extends CSSGradient {
  /*
  CSS Linear gradient formal syntax:
linear-gradient([orientation]deg,#[stop-color1] [offset]%,#[stop-color2] [offset]%...)

For the stop colors, we can set the opacity by changing the HEX into an RGBA value

  */

  orientation: number;
  stopColors: LinearGradientColorStop[];
  isRepeating: boolean;

  constructor() {
    super();

    this.stopColors = [];

    this.orientation = 0;

    this.isRepeating = false;
  }

  // Orientation in degrees
  setOrientation(orientation: number) {
    this.orientation = orientation;
  }

  addStopColor(stopColor: LinearGradientColorStop) {
    // The offset is a % which can be signed, can also be null if we don't want an offset
    // The color opacity is clamped between 0 & 100
    const properties: string[] = ["id", "color", "offset", "opacity"];
    for (const property of properties) {
      const doesNotHaveProperty: boolean = !stopColor.hasOwnProperty(property);
      if (doesNotHaveProperty) {
        throw new TypeError(
          `Invalid stop color for the linear gradient, ${property} does not exist on the passed`
        );
      }
    }

    const { id, color: hexColor, offset, opacity } = stopColor;

    const hexOpacity: string = percentageToHexAlpha(opacity);

    const fullColor: string = `${hexColor}${hexOpacity}`;

    const normalizedOffset: string = !offset ? "" : offset;

    stopColor.color = fullColor;
    stopColor.offset = normalizedOffset;

    this.stopColors.push(stopColor);

    this.sortStopColorsArrayById();
  }

  private sortStopColorsArrayById() {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
    // this.stopColors = this.stopColors.toSorted((obj1, obj2) => {
    //   return obj1.id - obj2.id;
    // });
  }

  setRepeating(repeatValue: boolean) {
    this.isRepeating = repeatValue;
  }

  generateCssGradient() {
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
      const stopColor: LinearGradientColorStop = this.stopColors[i];
      const { color, offset } = stopColor;

      const isLastIndex: boolean = i === this.stopColors.length - 1;
      const commaSeparator: string = isLastIndex ? "" : ", ";

      const normalizedOffset: string = !!offset ? ` ${offset}` : "";

      linearGradientString += `${color}${normalizedOffset}${commaSeparator}`;
    }
    linearGradientString += ")";
    return linearGradientString;
  }
}

export default CSSLinearGradient;

// Example usage:
const linearGradient = CSSGradient.create("linear") as CSSLinearGradient;
linearGradient.setRepeating(false);
linearGradient.setOrientation(135);
linearGradient.addStopColor({
  id: 0,
  color: "#ff0000",
  offset: null,
  opacity: "100%",
});
linearGradient.addStopColor({
  id: 1,
  color: "#00ff00",
  offset: null,
  opacity: "10%",
});
linearGradient.addStopColor({
  id: 2,
  color: "#0000ff",
  offset: null,
  opacity: "50%",
});

// linearGradient.

const generatedGradient = linearGradient.generateCssGradient();
console.log(generatedGradient);
