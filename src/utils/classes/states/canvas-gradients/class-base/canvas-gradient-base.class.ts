import {
  percentageToHex,
  stringPercentageToNumber,
} from "@utils/helpers/number.helpers";
import { PercentageString } from "@utils/variables/types/unit-types.variables";

export type CanvasLinearGradientColorStop = {
  id: number;
  color: string;
  offset: number | PercentageString;
  opacity: string;
};

export type CanvasRadialGradientColorStop = {
  id: number;
  color: string;
  offset: number | PercentageString;
  opacity: string;
};

export type CanvasConicGradientColorStop = {
  id: number;
  color: string;
  offset: number | PercentageString;
  opacity: string;
};

export type CanvasGradientColorStop =
  | CanvasLinearGradientColorStop
  | CanvasRadialGradientColorStop
  | CanvasConicGradientColorStop;

/**
 * Base class for creating canvas gradients.
 */
class CanvasGradientBase {
  /**
   * An array of color stops for the gradient.
   *
   * @type {CanvasGradientColorStop[]}
   */
  stopColors: CanvasGradientColorStop[];

  /**
   * The 2D rendering context of the canvas.
   *
   * @type {CanvasRenderingContext2D}
   */
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;

    this.stopColors = [];
  }

  /**
   * Calculates the offset for a color stop based on its index and the total number of color stops.
   *
   * @param {number} index - The index of the color stop.
   *
   * @param {number} amountOfColors - The total number of color stops.
   *
   * @returns {number} The calculated offset.
   *
   * @protected
   */
  protected getOffsetByIndex(index: number, amountOfColors: number): number {
    return index / (amountOfColors - 1);
  }

  /**
   * Normalizes the opacity value of a color stop by converting it to its hexadecimal representation
   * and appending it to the color. The opacity should be in the range of 0 to 100%.
   *
   * @param {CanvasGradientColorStop} stopColor - The color stop to normalize.
   * @protected
   */
  protected normalizeOpacity(stopColor: CanvasGradientColorStop): void {
    const { color: hexColor, opacity } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;
  }

  /**
   * Normalizes the offset value of a color stop, converting percentage strings to numbers.
   * @param {CanvasGradientColorStop} stopColor - The color stop to normalize.
   * @protected
   */
  protected normalizeOffset(stopColor: CanvasGradientColorStop): void {
    const { offset } = stopColor;

    const normalizedOffset: number =
      offset === null
        ? NaN
        : stringPercentageToNumber(offset as PercentageString);

    stopColor.offset = normalizedOffset;
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
   *
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

    const objectToReplace: CanvasGradientColorStop =
      this.stopColors[indexToReplace];
    objectToReplace.id = newId;
    this.stopColors.splice(indexToReplace, 1, objectToReplace);

    const objectToBeReplacedBy: CanvasGradientColorStop =
      this.stopColors[indexToBeReplacedBy];
    objectToBeReplacedBy.id = oldId;
    this.stopColors.splice(indexToBeReplacedBy, 1, objectToBeReplacedBy);

    this.sortStopColorsArrayById();
  }
}

export default CanvasGradientBase;
