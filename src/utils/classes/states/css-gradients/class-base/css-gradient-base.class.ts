import { percentageToHex } from "@utils/helpers/number.helpers";
import { CSSConicGradientColorStop } from "../conic/css-conic-gradient.class";
import { CSSLinearGradientColorStop } from "../linear/css-linear-gradient.class";
import { CSSRadialGradientColorStop } from "../radial/css-radial-gradient.class";

type CSSGradientColorStop =
  | CSSLinearGradientColorStop
  | CSSRadialGradientColorStop
  | CSSConicGradientColorStop;

type CSSGradientColorStopArray = CSSGradientColorStop[];

class CSSGradientBase {
  isRepeating: boolean;
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

  protected normalizeOpacity(stopColor: CSSGradientColorStop): void {
    const { color: hexColor, opacity } = stopColor;

    const hexOpacity: string = percentageToHex(opacity);
    const fullColor: string = `${hexColor}${hexOpacity}`;
    stopColor.color = fullColor;
  }

  protected normalizeOffset(
    stopColor: Exclude<CSSGradientColorStop, CSSConicGradientColorStop>
  ): void {
    const { offset } = stopColor;

    const normalizedOffset: string = !offset ? "" : offset;
    stopColor.offset = normalizedOffset;
  }

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

  protected sortStopColorsArrayById<TObj extends CSSGradientColorStop>(): void {
    this.stopColors.sort((obj1: TObj, obj2: TObj) => {
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
      oldId < 0 ||
      newId > this.stopColors.length ||
      indexToReplace === -1 ||
      indexToBeReplacedBy === -1;

    if (hasInvalidArguments) {
      throw new RangeError(`Invalid...`);
    }
  }
}

export default CSSGradientBase;
