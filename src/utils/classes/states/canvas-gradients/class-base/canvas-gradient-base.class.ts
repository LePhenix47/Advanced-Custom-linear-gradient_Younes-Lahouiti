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

class CanvasGradientBase {
  stopColors: any[];
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;

    this.stopColors = [];
  }

  protected getOffsetByIndex(index: number, amountOfColors: number): number {
    return index / (amountOfColors - 1);
  }

  protected normalizeOpacity(stopColor: CanvasGradientColorStop): void {
    const { color: hexColor, opacity } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;
  }

  protected normalizeOffset(stopColor: CanvasGradientColorStop): void {
    const { offset } = stopColor;

    const normalizedOffset: number =
      offset === null
        ? NaN
        : stringPercentageToNumber(offset as PercentageString);

    stopColor.offset = normalizedOffset;
  }

  protected sortStopColorsArrayById(): void {
    this.stopColors.sort((obj1, obj2) => {
      return obj1.id - obj2.id;
    });
  }

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

    const objectToReplace = this.stopColors[indexToReplace];
    this.stopColors.splice(indexToReplace, 1, objectToReplace);

    const objectToBeReplacedBy = this.stopColors[indexToBeReplacedBy];
    this.stopColors.splice(indexToBeReplacedBy, 1, objectToBeReplacedBy);
  }
}

export default CanvasGradientBase;
