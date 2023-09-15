import { percentageToHex } from "@utils/helpers/number.helpers";
import { CSSConicGradientColorStop } from "../conic/css-conic.class";
import { CSSLinearGradientColorStop } from "../linear/css-linear.class";
import { CSSRadialGradientColorStop } from "../radial/css-radial.class";

type CSSGradientColorStop =
  | CSSLinearGradientColorStop
  | CSSRadialGradientColorStop
  | CSSConicGradientColorStop;

type CSSGradientColorStopArray = CSSGradientColorStop[];

class CSSGradientBase {
  /**
   * Boolean value saying whether the gradient should repeat.
   * @type {boolean}
   */
  isRepeating: boolean;

  /**
   * An array of color stops for the gradient.
   * @type {CSSGradientColorStopArray}
   */
  stopColors: CSSGradientColorStopArray;

  constructor() {
    this.isRepeating = false;

    this.stopColors = [];
  }

  /**
   * Set whether the gradient should repeat.
   * @param {boolean} repeatValue - If true, the gradient will repeat.
   * @returns {void}
   */
  setRepeating(repeatValue: boolean): void {
    this.isRepeating = repeatValue;
  }

  /**
   * Normalizes the opacity value of a color stop by converting it to its hexadecimal representation
   * and appending it to the color. The opacity should be in the range of 0 to 100%.
   *
   * @param {CSSGradientColorStop} stopColor - The color stop to normalize.
   * @protected
   */
  protected normalizeOpacity(stopColor: CSSGradientColorStop): void {
    const { color: hexColor, opacity } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;
  }

  /**
   * Normalizes the offset value of a color stop, converting it to a string.
   *
   * @param {CSSLinearGradientColorStop | CSSRadialGradientColorStop} stopColor - The color stop to normalize.
   * @protected
   */
  protected normalizeOffset(
    stopColor: Exclude<CSSGradientColorStop, CSSConicGradientColorStop>
  ): void {
    const { offset } = stopColor;

    const normalizedOffset: string = !offset ? "" : offset;
    stopColor.offset = normalizedOffset;
  }

  /**
   * Normalizes the angles in degrees for a conic gradient color stop.
   *
   * @param {CSSConicGradientColorStop} stopColor - The conic gradient color stop to normalize.
   * @protected
   */
  protected normalizeAngles(
    stopColor: Extract<CSSGradientColorStop, CSSConicGradientColorStop>
  ): void {
    const { startAngle, endAngle, transitionAngle } = stopColor;

    const formattedStartAngle: string = !startAngle ? "" : `${startAngle}deg`;
    stopColor.startAngle = formattedStartAngle;

    const formattedEndAngle: string = !endAngle ? "" : `, ${endAngle}deg`;
    stopColor.endAngle = formattedEndAngle;

    const formattedTransitionAngle: string = !transitionAngle
      ? ""
      : `${transitionAngle}deg`;
    stopColor.transitionAngle = formattedTransitionAngle;
  }

  /**
   * Sorts the color stops in the array by their `id` property.
   * @protected
   */
  protected sortStopColorsArrayById(): void {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

  /**
   * Changes the order of color stops by updating their `id` properties.
   *
   * @param {number} oldId - The current `id` of the color stop to be moved.
   * @param {number} newId - The new `id` to assign to the color stop.
   */
  changeColorOrderById(oldId: number, newId: number): void {
    const indexToReplace: number = this.stopColors.findIndex((stopCol) => {
      return stopCol.id === oldId;
    });

    const indexToBeReplacedBy: number = this.stopColors.findIndex((stopCol) => {
      return stopCol.id === newId;
    });

    const hasInvalidArguments: boolean =
      indexToReplace === -1 || indexToBeReplacedBy === -1;

    if (hasInvalidArguments) {
      throw new RangeError(
        `Invalid id arguments, expected both to ids to return their referring objects but couldn't find them, with oldId (${oldId}): ${
          indexToBeReplacedBy !== 1
            ? "found old object"
            : "couldn't find old object"
        } and with newId (${newId}): ${
          indexToReplace !== 1 ? "found new object" : "couldn't find new object"
        }`
      );
    }

    const objectToReplace: CSSGradientColorStop =
      this.stopColors[indexToReplace];
    objectToReplace.id = newId;
    this.stopColors.splice(indexToReplace, 1, objectToReplace);

    const objectToBeReplacedBy: CSSGradientColorStop =
      this.stopColors[indexToBeReplacedBy];
    objectToBeReplacedBy.id = oldId;
    this.stopColors.splice(indexToBeReplacedBy, 1, objectToBeReplacedBy);
  }
}

export default CSSGradientBase;
